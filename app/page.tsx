import "@/app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { getFeaturedProducts } from "@/services/products";

Amplify.configure(outputs);

export default async function App() {
  const featuredProducts = await getFeaturedProducts();
  console.log(featuredProducts);
  return (
    <main>
      <h1>Welcome to Wizzingtom Moo's UK</h1>
    </main>
  );
}
