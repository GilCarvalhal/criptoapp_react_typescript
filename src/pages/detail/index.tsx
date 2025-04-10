import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CoinProps } from "../home";

interface ResponseData {
  data: CoinProps;
}

interface ErrorData {
  error: string;
}

type DataProps = ResponseData | ErrorData;

export function Detail() {
  const { cripto } = useParams();

  const [coin, setCoin] = useState<CoinProps>();

  const navigate = useNavigate();

  useEffect(() => {
    async function getCoin() {
      try {
        fetch(
          `https://rest.coincap.io/v3/assets/${cripto}?&apiKey=67454d839e927eb57d312ad9fcb228f58ef869a850cd0553299e0ca3c8e17f67`
        )
          .then((response) => response.json())
          .then((data: DataProps) => {
            if ("error" in data) {
              navigate("/");
              return;
            }

            const price = Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            });

            const priceCompact = Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "compact",
            });

            const resultData = {
              ...data.data,
              formatedPrice: price.format(Number(data.data.priceUsd)),
              formatMarket: priceCompact.format(Number(data.data.marketCapUsd)),
              formatVolume: priceCompact.format(
                Number(data.data.volumeUsd24Hr)
              ),
            };

            setCoin(resultData);
          });
      } catch (err) {
        console.log(err);
        navigate("/");
      }
    }
    getCoin();
  }, [cripto]);

  return (
    <div>
      <h1>Página detalhe da moeda {cripto}</h1>
    </div>
  );
}
