import { useState } from "react";
import { purchaseService } from "../services/purchase.service";
import { invoiceService } from "../services/invoice.service";

export const useFinance = () => {
  const [purchasesData, setPurchasesData] = useState<any>(null);
  const [invoicesData, setInvoicesData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPurchases = async (page = 0, size = 20) => {
    setLoading(true);
    try {
      const res = await purchaseService.getAll(page, size);
      setPurchasesData(res);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar compras");
    } finally {
      setLoading(false);
    }
  };

  const getInvoices = async (page = 0, size = 20) => {
    setLoading(true);
    try {
      const res = await invoiceService.getAll(page, size);
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
