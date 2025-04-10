import { BsSearch } from "react-icons/bs";
import styles from "./home.module.css";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";

interface CoinProps {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  vwap24Hr: string;
  changePercent24Hr: string;
  rank: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  explorer: string;
  formatedPrice?: string;
  formatMarket?: string;
  formatVolume?: string;
}

interface DataProps {
  data: CoinProps[];
}

export function Home() {
  const [input, setInput] = useState("");
  const [coins, setCoins] = useState<CoinProps[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    fetch(
      "https://rest.coincap.io/v3/assets?limit=10&offset=0&apiKey=67454d839e927eb57d312ad9fcb228f58ef869a850cd0553299e0ca3c8e17f67"
    )
      .then((response) => response.json())
      .then((data: DataProps) => {
        const coinsData = data.data;

        const price = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        });

        const priceCompact = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact",
        });

        const formatedResult = coinsData.map((value) => {
          const formated = {
            ...value,
            formatedPrice: price.format(Number(value.priceUsd)),
            formatMarket: priceCompact.format(Number(value.marketCapUsd)),
            formatVolume: priceCompact.format(Number(value.volumeUsd24Hr)),
          };
          return formated;
        });
        console.log(formatedResult);
        setCoins(formatedResult);
      });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (input === "") return;

    navigate(`/detail/${input}`);
  }

  function handleGetMore() {
    console.log("teste");
  }

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={`Digite o nome da moeda...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">
          <BsSearch size={30} color="#fff" />
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope="col">Moeda</th>
            <th scope="col">Valor Mercado</th>
            <th scope="col">Preço</th>
            <th scope="col">Volume</th>
            <th scope="col">Mudança 24h</th>
          </tr>
        </thead>

        <tbody id="tbody">
          {coins.length > 0 &&
            coins.map((value) => (
              <tr className={styles.tr} key={value.id}>
                <td className={styles.tdLabel} data-label="Moeda">
                  <div className={styles.name}>
                    <img
                    className={styles.logo}
                      src={`https://assets.coincap.io/assets/icons/${value.symbol.toLowerCase()}@2x.png`}
                      alt="Logo Cripto"
                    />
                    <Link to={`/detail/${value.id}`}>
                      <span>{value.name}</span> | {value.symbol}
                    </Link>
                  </div>
                </td>

                <td className={styles.tdLabel} data-label="Valor mercado">
                  {value.formatMarket}
                </td>

                <td className={styles.tdLabel} data-label="Preço">
                  {value.formatedPrice}
                </td>

                <td className={styles.tdLabel} data-label="Volume">
                  {value.formatVolume}
                </td>

                <td
                  className={
                    Number(value.changePercent24Hr) > 0
                      ? styles.tdProfit
                      : styles.tdLoss
                  }
                  data-label="Mudança 24h"
                >
                  <span>{Number(value.changePercent24Hr).toFixed(3)}</span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <button className={styles.buttonMore} onClick={handleGetMore}>
        Carregar mais
      </button>
    </main>
  );
}
