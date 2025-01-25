"use client";

import {
  PublicKey,
  LAMPORTS_PER_SOL,
  StakeProgram,
  Keypair,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import toast from "react-hot-toast";

const truncateTxId = (txId: string, startLength: number = 4, endLength: number = 4): string => {
  if (txId.length <= startLength + endLength) {
    return txId; // Return as is if the length is too short
  }
  return `${txId.slice(0, startLength)}...${txId.slice(-endLength)}`;
};

const VOTE_ACCOUNT = new PublicKey("eyeVhGmVEoPSWmQU2wP5WZmMihPBTCk7kMMm4VhuAKS");

const StakingComponent: React.FC = () => {
  const { publicKey, wallet, connected, signTransaction, disconnect } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number>(0);
  const [amountToStake, setAmountToStake] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refresh = async () => {
    if (connection && publicKey) {
      const lamports = await connection.getBalance(publicKey);
      setBalance(Math.abs(lamports - 1000000) / LAMPORTS_PER_SOL);
      setAmountToStake("0");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      refresh();
    }
  }, [connected, publicKey]);

  const handleStake = async () => {
    if (!connected || !wallet || !signTransaction || !publicKey) {
      toast.error("Please connect your wallet first.");
      return;
    }
    if (!amountToStake || isNaN(parseFloat(amountToStake)) || parseFloat(amountToStake) <= 0) {
      toast.error("Please enter a valid amount of SOL to stake.");
      return;
    }

    if (parseFloat(amountToStake) > balance ) {
        toast.error("You have insufficient funds.");
        return;
      }

    try {
      setIsLoading(true);
      const stakeKey = new Keypair();
      const lamportsToStake = parseFloat(amountToStake) * LAMPORTS_PER_SOL;

      const stakeTransaction = StakeProgram.createAccount({
        fromPubkey: publicKey,
        stakePubkey: stakeKey.publicKey,
        authorized: {
          staker: publicKey,
          withdrawer: publicKey,
        },
        lamports: lamportsToStake,
      });

      const delegate = StakeProgram.delegate({
        stakePubkey: stakeKey.publicKey,
        authorizedPubkey: publicKey,
        votePubkey: VOTE_ACCOUNT,
      });

      const transaction = stakeTransaction.add(delegate);

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey!;
      transaction.partialSign(stakeKey);

      const signedTransaction = await signTransaction(transaction);
      const txid = await connection.sendRawTransaction(signedTransaction.serialize());
      const confirmation = await connection.confirmTransaction({
        signature: txid,
        blockhash,
        lastValidBlockHeight,
      });

      if (confirmation.value.err) {
        toast.error(`Error staking SOL: ${confirmation.value.err}`);
      } else {
        await refresh();
        toast.success(`Staked successfully! TX ID: ${truncateTxId(txid)}`);
      }
    } catch (error: any) {
      toast.error(`Error staking SOL: ${error.messag as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaxClick = () => {
    setAmountToStake(balance.toString());
  };

  return (
    <>
    <div className=" relative px-6 py-4 bg-[#1E1E2A] text-white rounded-lg shadow-lg max-w-lg w-full sm:px-8 sm:py-6 md:max-w-2xl">
  
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center text-[#32FECB]">Stake</h1>
      <p className="text-center mb-6 text-sm md:text-base text-gray-400">
        Stake with one of Solana's most performant validators.
      </p>

         <>
          <div className="mb-6">
            <label className="block text-sm md:text-base mb-2 text-gray-400">You're staking</label>
            <div className="flex items-center bg-[#2E2E3A] rounded-lg px-4 py-3 relative">
              <input
                type="number"
                value={amountToStake}
                onChange={(e) => setAmountToStake(e.target.value)}
                className="flex-1 bg-transparent text-white outline-none text-lg"
                placeholder="Enter SOL amount"
              />
              <span className="text-gray-400 ml-2">SOL</span>
            </div>

            <div className="flex items-center justify-between mt-2 px-1 text-sm md:text-base text-gray-400">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c.284 0 .567.012.847.035A9.982 9.982 0 0112 3c-4.418 0-8 3.582-8 8 0 .86.13 1.693.368 2.482A10.006 10.006 0 013 12c0-5.523 4.477-10 10-10zm3 11v4m0-4l-3 3m3-3l3 3"
                  />
                </svg>
                {balance.toFixed(4)} SOL
              </div>
              <button onClick={handleMaxClick} className="text-[#FFCB00] font-semibold">
                Max
              </button>
            </div>
          </div>
          {!connected ? (
        <WalletMultiButton  className="wallet-adapter-button"/>
      ) : 
          <button
            onClick={handleStake}
            disabled={isLoading}
            className={`w-full flex justify-center items-center bg-gradient-to-r from-[#32FECB] to-[#A2FF63] text-[#15151F] font-bold text-lg md:text-xl uppercase py-4 px-6 rounded-lg shadow-lg transition-all ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-105 hover:shadow-xl active:scale-95"
            }`}
          >
   
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-t-[#fff] border-[#15151F] rounded-full animate-spin"></div>
            ) : (
              "Stake"
            )}
          </button>
}
        </>
      
    </div>
        <div className=" text-xs flex w-full justify-center gap-5">
        {connected ? (<>
            <p>{publicKey ? truncateTxId(publicKey?.toBase58()): ""}</p>
        
        <button onClick={() => {
            disconnect()
        }}>disconnect</button>
        
        </>
        ): ""}
    
      </div>
    </>
  );
};

export default StakingComponent;