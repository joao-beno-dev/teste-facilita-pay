import { AxiosInstance } from "axios";
import { Taxas, Taxa, TaxaEm } from "@/model";

const API_BASE = "https://api.exchangeratesapi.io";

export default (axios: AxiosInstance) => ({
  getTaxa(simboloUm: string, simboloDois: string) {
    return axios.get<Taxas<Taxa>>(
      `${API_BASE}/latest?symbols=${simboloUm}&base=${simboloDois}`
    );
  },
  getHistorico(simboloUm: string, simboloDois: string, startDate: Date, endDate: Date) {
    return axios.get<Taxas<TaxaEm>>(
      `${API_BASE}/history?start_at=${startDate.toISOString().substr(0, 10)}&end_at=${endDate.toISOString().substr(0, 10)}&symbols=${simboloUm}&base=${simboloDois}`
    );
  }
});
