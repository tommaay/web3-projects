"use client";

import { FormEvent, useState } from "react";
import { useAddress, useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";
import HeroCard from "components/HeroCard";
import { Card, CardDescription, CardHeader, CardTitle } from "components/ui/Card";
import { SpinnerRoundFilled } from "spinners-react";
import { CURRENT_MOOD_CONTRACT } from "@/constants";
import { useToast } from "components/ui/useToast";
import { Input } from "components/ui/Input";
import { Button } from "components/ui/Button";
import FramerAnimate from "components/FramerAnimate";

const CurrentMoodPage = () => {
  const address = useAddress();
  const { contract, isLoading: contractIsLoading } = useContract(CURRENT_MOOD_CONTRACT);
  const { data: owner, isLoading: ownerIsLoading } = useContractRead(contract, "owner");
  const { data: ownersMood, isLoading: ownersMoodIsLoading } = useContractRead(
    contract,
    "getMood",
    [owner]
  );
  const { data: yourMood, isLoading: yourMoodIsLoading } = useContractRead(contract, "getMood", [
    address,
  ]);
  const { mutateAsync: createMood, isLoading: creatingMood } = useContractWrite(
    contract,
    "createMood"
  );
  const { mutateAsync: updateMood, isLoading: updatingMood } = useContractWrite(
    contract,
    "updateMood"
  );

  const isLoading = contractIsLoading || ownerIsLoading || ownersMoodIsLoading || yourMoodIsLoading;

  const { toast } = useToast();

  const [moodInput, setMoodInput] = useState("");

  const onSubmitMood = (e: MouseEvent | FormEvent) => {
    e.preventDefault();

    if (!yourMood) {
      createMood({ args: [moodInput] })
        .then(() => {
          toast({
            title: "Mood created",
            description: "Your mood has been created and stored on the blockchain.",
          });
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "Failed to create mood.",
          });
        });
    } else {
      updateMood({ args: [moodInput] })
        .then(() => {
          toast({
            title: "Mood updated",
            description: "Your mood has been updated and stored on the blockchain.",
          });
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "Failed to update mood.",
          });
        });
    }

    setMoodInput("");
  };

  return (
    <FramerAnimate>
      <main className="container py-sm md:py-md">
        <HeroCard
          title="Record your current mood"
          description="Write and store your mood on the blockchain."
          imageUrl="/mood_in_grey_color.png"
          altText="Anime girl thinking about her mood."
          isLoading={false}
        />

        <div className="grid gap-4 mt-12 md:gap-10 md:grid-cols-2">
          <Card className="w-full h-full mx-auto rounded-xl">
            <CardHeader>
              <CardTitle className="mb-2">
                <h3>{`The contract owner's mood`}</h3>
              </CardTitle>
              {isLoading ? (
                <SpinnerRoundFilled color="#fff" className="mx-auto mt-10" />
              ) : (
                <CardDescription>
                  <p className="text-lg font-medium">{ownersMood}</p>
                </CardDescription>
              )}
            </CardHeader>
          </Card>

          <Card className="w-full h-full mx-auto rounded-xl">
            <CardHeader>
              <CardTitle className="mb-2">
                <h3>Your current mood</h3>
              </CardTitle>
              {isLoading || creatingMood || updatingMood ? (
                <SpinnerRoundFilled color="#fff" className="mx-auto mt-10" />
              ) : (
                <CardDescription>
                  {address ? (
                    <p
                      className={`text-lg font-medium ${
                        !yourMood ? "text-red-100/90" : "text-green-200"
                      }`}
                    >
                      {yourMood ?? "No mood yet. Share and post your first mood"}
                    </p>
                  ) : (
                    <p className="text-lg font-medium">
                      Connect your wallet to see and record your mood
                    </p>
                  )}
                </CardDescription>
              )}
            </CardHeader>
          </Card>
        </div>

        {address && (
          <form
            className="flex max-w-2xl mx-auto mt-10 overflow-hidden border rounded-full border-white/50"
            onSubmit={onSubmitMood}
          >
            <Input
              className="w-3/4 p-4"
              value={moodInput}
              onChange={(e) => setMoodInput(e.target.value)}
            />
            <Button
              className="w-1/4 text-lg bg-opacity-50 hover:bg-slate-500 hover:text-white"
              onClick={onSubmitMood}
              disabled={creatingMood || updatingMood}
            >
              {yourMood ? "Update mood" : "Record mood"}
            </Button>
          </form>
        )}
      </main>
    </FramerAnimate>
  );
};

export default CurrentMoodPage;
