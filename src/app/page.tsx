import ContractCard from "components/ContractCard";
import {
  ERC20_CONTRACT,
  ERC721A_CONTRACT,
  ERC1155_CONTRACT,
  COIN_FLIP_CONTRACT,
  BUY_COFFEE_CONTRACT,
  CURRENT_MOOD_CONTRACT,
  MESSAGE_BOARD_CONTRACT,
  STAKING_CONTRACT,
} from "@/constants";

export default function Home() {
  return (
    <main className="container py-sm md:py-md">
      <h1 className="pb-2 text-4xl font-medium md:text-5xl lg:text-6xl bg-gradient-to-br text-gradient-blue w-max">
        Web3 Projects
      </h1>
      <p className="pt-2 font-medium text:lg md:text-xl">
        Select a project to interact with its smart contract.
      </p>

      <div className="grid justify-center gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-lg">
        <ContractCard href="/erc20" contractAddress={ERC20_CONTRACT} />
        <ContractCard href="/erc721a" contractAddress={ERC721A_CONTRACT} />
        <ContractCard href="/erc1155" contractAddress={ERC1155_CONTRACT} />
        <ContractCard
          href="/coinflip"
          contractAddress={COIN_FLIP_CONTRACT}
          title="Heads or Tails"
          description="A smart contract heads or tails game."
          imageUrl="/coins.png"
        />
        <ContractCard
          href="/buycoffee"
          contractAddress={BUY_COFFEE_CONTRACT}
          title="Buy Me a Coffee"
          description="A smart contract to buy a friend a coffee by sending Eth."
          imageUrl="/hot_cup_of_coffee.png"
        />
        <ContractCard
          href="/current-mood"
          contractAddress={CURRENT_MOOD_CONTRACT}
        />
        <ContractCard
          href="/message-board"
          contractAddress={MESSAGE_BOARD_CONTRACT}
          title="Message Board"
          description="A smart contract that allows uer to post messages to the smart contract."
          imageUrl="/retro_message_board.png"
        />
        <ContractCard
          href="/staking"
          contractAddress={STAKING_CONTRACT}
          imageUrl="/cypherpunk_anime_girl_3.png"
        />
      </div>
    </main>
  );
}
