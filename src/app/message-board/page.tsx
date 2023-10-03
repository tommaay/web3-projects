"use client";

import { FormEvent, useState } from "react";
import { useAddress, useContract, useContractEvents, useContractWrite } from "@thirdweb-dev/react";
import HeroCard from "components/HeroCard";
import { Card, CardDescription, CardHeader, CardTitle } from "components/ui/Card";
import { SpinnerRoundFilled } from "spinners-react";
import { MESSAGE_BOARD_CONTRACT } from "@/constants";
import { useToast } from "components/ui/useToast";
import { Input } from "components/ui/Input";
import { Button } from "components/ui/Button";
import FramerAnimate from "components/FramerAnimate";

const MessageBoardPage = () => {
  const address = useAddress();
  const { contract, isLoading: contractIsLoading } = useContract(MESSAGE_BOARD_CONTRACT);
  const { mutateAsync: postMessage, isLoading: postingMessage } = useContractWrite(
    contract,
    "postMessage"
  );
  const { data: messages, isLoading: messagesIsLoading } = useContractEvents(contract);

  const isLoading = contractIsLoading || messagesIsLoading;

  const { toast } = useToast();

  const [messageInput, setMessageInput] = useState("");

  const onSubmitMood = (e: MouseEvent | FormEvent) => {
    e.preventDefault();

    postMessage({ args: [messageInput] })
      .then(() => {
        toast({
          title: "Message posted",
          description: "Your message has been created and stored on the blockchain.",
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to post message.",
        });
      });

    setMessageInput("");
  };

  return (
    <FramerAnimate>
      <main className="container py-sm md:py-md">
        <HeroCard
          title="Message Board"
          description="A smart contract that allows users to post messages to the smart contract. It also gets the events of all messages posted and displays them."
          imageUrl="/retro_message_board.png"
          altText="A retro message board"
          isLoading={false}
        />

        {address ? (
          <form
            className="flex max-w-2xl mx-auto mt-10 overflow-hidden border rounded-full border-white/50"
            onSubmit={onSubmitMood}
          >
            <Input
              className="w-3/4 p-4"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <Button
              className="w-1/4 p-4 text-lg bg-opacity-50 hover:bg-slate-500 hover:text-white"
              onClick={onSubmitMood}
              disabled={postingMessage}
            >
              {postingMessage ? "Posting..." : "Post"}
            </Button>
          </form>
        ) : (
          <h3 className="mx-auto mt-10 text-xl text-center md:text-2xl">
            Connect your wallet to post a message to the smart contract
          </h3>
        )}

        <div className="mt-10">
          {isLoading ? (
            <SpinnerRoundFilled color="#fff" className="mx-auto" />
          ) : (
            messages?.map(({ data: { sender, message }, transaction: { blockHash } }) => {
              return (
                <Card className="w-full h-full max-w-2xl mx-auto mb-6 rounded-xl" key={blockHash}>
                  <CardHeader>
                    <CardTitle className="mb-2">
                      <h3 className="overflow-hidden text-base text-ellipsis">{sender}</h3>
                    </CardTitle>
                    <CardDescription>
                      <p className="font-medium md:text-lg text-md">{message}</p>
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })
          )}
        </div>
      </main>
    </FramerAnimate>
  );
};

export default MessageBoardPage;
