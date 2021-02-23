import { AxiosInstance } from "axios";
import { Taxas } from "@/model";

export default (axios: AxiosInstance) => ({
  getTaxa(simboloUm: string, simboloDois: string) {
    return axios.get<Taxas>(`https://api.exchangeratesapi.io/latest?symbols=${simboloUm}&base=${simboloDois}`);
  }
});
