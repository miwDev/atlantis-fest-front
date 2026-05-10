import { useState } from "react";
import { purchaseService } from "../services/purchase.service";
import { invoiceService } from "../services/invoice.service";

export const useFinance = () => {
  const [purchasesData, setPurchasesData] = useState<any>(null);
  const [invoicesData, setInvoicesData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [sortString, setSortString] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  const getPurchases = async (page: number = 0, sort: string | undefined = sortString) => {
    if (sort !== sortString) setSortString(sort);
    setLoading(true);
    try {
      const res = await purchaseService.getAll(page, 5, sort);
      setPurchasesData(res);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar compras");
    } finally {
      setLoading(false);
    }
  };

  const getInvoices = async (page: number = 0, sort: string | undefined = sortString) => {
    if (sort !== sortString) setSortString(sort);
    setLoading(true);
    try {
      const res = await invoiceService.getAll(page, 5, sort);
      setInvoicesData(res);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar facturas");
    } finally {
      setLoading(false);
    }
  };

  return {
    purchases: purchasesData?.content || [],
    invoices: invoicesData?.content || [],
    purchasesPagination: purchasesData,
    invoicesPagination: invoicesData,
    loading,
    error,
    getPurchases,
    getInvoices,
  };
};
