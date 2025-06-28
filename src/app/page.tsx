"use client";

import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { votingSystemABI } from "../contracts/VotingSystem";
import { ConnectButton } from "@rainbow-me/rainbowkit";

// Type for voting state (matches your Solidity enum)
type VoteState = 0 | 1 | 2; // NotStarted | Active | Ended

export default function HomePage() {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  // Read contract state with proper typing
  const { data: voteState } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: votingSystemABI,
    functionName: "voteState",
  }) as { data: VoteState };

  const { data: results } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: votingSystemABI,
    functionName: "getResults",
  }) as { data: [bigint, bigint] | undefined };

  const startVoting = async () => {
    try {
      const txHash = await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: votingSystemABI,
        functionName: "startVoting",
      });
      console.log("Transaction Hash:", txHash);
    } catch (error) {
      console.error("Error starting vote:", error);
    }
  };

  const endVoting = async () => {
    try {
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: votingSystemABI,
        functionName: "endVoting",
      });
    } catch (error) {
      console.error("Failed to end voting:", error);
    }
  };

  const vote = async (choice: boolean) => {
    try {
      await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: votingSystemABI,
        functionName: "vote",
        args: [choice],
      });
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  // Check if current user is owner
  const { data: owner } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: votingSystemABI,
    functionName: "owner",
  }) as { data: `0x${string}` | undefined };

  const isOwner = owner?.toLowerCase() === address?.toLowerCase();

  return (
    <main className="min-h-screen p-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Decentralized Voting System</h1>
          <w3m-connect-button />
        </div>

        {isConnected && (
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Voting Status</h2>
              <p className="mb-2">
                Current State:{" "}
                {voteState === 0
                  ? "Not Started"
                  : voteState === 1
                  ? "Active"
                  : "Ended"}
              </p>

              {isOwner && (
                <div className="space-x-4 mt-4">
                  <button
                    onClick={startVoting}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
                    disabled={voteState !== 0}
                  >
                    Start Voting
                  </button>
                  <button
                    onClick={endVoting}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 cursor-pointer"
                    disabled={voteState !== 1}
                  >
                    End Voting
                  </button>
                </div>
              )}
            </div>

            {voteState === 1 && (
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Cast Your Vote</h2>
                <div className="space-x-4">
                  <button
                    onClick={() => vote(true)}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 cursor-pointer"
                  >
                    Yes ✅
                  </button>
                  <button
                    onClick={() => vote(false)}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 cursor-pointer"
                  >
                    No ❌
                  </button>
                </div>
              </div>
            )}

            {voteState === 2 && results && (
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Final Results</h2>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-green-100 p-4 rounded">
                    <p className="text-2xl font-bold text-green-600">
                      {results[0].toString()}
                    </p>
                    <p className="text-gray-600">Yes Votes</p>
                  </div>
                  <div className="bg-red-100 p-4 rounded">
                    <p className="text-2xl font-bold text-red-600">
                      {results[1].toString()}
                    </p>
                    <p className="text-gray-600">No Votes</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
