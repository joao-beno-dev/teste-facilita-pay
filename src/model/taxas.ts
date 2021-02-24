import { Taxa, TaxaEm, BaseTaxa } from ".";

export class Taxas<T extends BaseTaxa> {
  rates: T;
  base: string;
  date?: Date;
  start_at?: Date;
  end_at?: Date;
}
