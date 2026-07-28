import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import { format } from "date-fns";

const formatCurrency = (amount: number) => {
  return (
    "Rs. " +
    amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    padding: 0, // Reset padding
    fontSize: 10,
    color: "#334155", // slate-700
  },
  // Replicating web 'bg-slate-50'
  bodyWrapper: {
    padding: 30,
    backgroundColor: "#f8fafc", // slate-50
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e2e8f0", // slate-200
  },
  // Replicating 'bg-emerald-50/50 border-b border-emerald-100/50 p-4 flex justify-between'
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ecfdf5", // emerald-50
    borderBottomWidth: 1,
    borderBottomColor: "#d1fae5", // emerald-100
  },
  successBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  successText: {
    color: "#047857", // emerald-700
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  poweredBy: {
    fontSize: 9,
    color: "#94a3b8", // slate-400
  },
  poweredByCompany: {
    fontWeight: "bold",
    color: "#475569", // slate-600
  },
  content: {
    padding: 30,
  },
  // Main Amount Header
  amountSection: {
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0", // slate-200
    borderStyle: "dashed",
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  amountLabel: {
    fontSize: 10,
    color: "#64748b", // slate-500
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  amountValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0f172a", // slate-900
  },
  dateSection: {
    alignItems: "flex-end",
  },
  dateLabel: {
    fontSize: 9,
    color: "#64748b", // slate-500
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 10,
    color: "#334155", // slate-700
    fontWeight: "bold",
  },
  grid: {
    flexDirection: "row",
    marginBottom: 30,
    gap: 40,
  },
  col: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#94a3b8", // slate-400
    textTransform: "uppercase",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  partyName: {
    fontSize: 12, // text-lg
    fontWeight: "bold",
    color: "#0f172a", // slate-900
    marginBottom: 4,
  },
  partyDetail: {
    fontSize: 10,
    color: "#475569", // slate-600
    marginBottom: 2,
    lineHeight: 1.4,
  },
  detailsTable: {
    backgroundColor: "#f8fafc", // slate-50
    borderRadius: 6,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0", // slate-200
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0", // slate-200
  },
  detailLabel: {
    color: "#64748b", // slate-500
    fontSize: 10,
  },
  detailValue: {
    color: "#1e293b", // slate-800
    fontSize: 10,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 8,
    color: "#94a3b8", // slate-400
    textAlign: "center",
    lineHeight: 1.5,
  },
});

export interface ReceiptData {
  paymentId: string;
  paymentDate: Date;
  invoiceNumber: string;
  amount: number;
  vendorName: string;
  vendorEmail: string;
  vendorGst?: string;
  companyName?: string;
  companyEmail?: string;
}

const ReceiptDocument = ({ data }: { data: ReceiptData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.bodyWrapper}>
        {/* Card Wrapper */}
        <View style={styles.card}>
          {/* Header (Emerald) */}
          <View style={styles.header}>
            <View style={styles.successBadge}>
              <Text style={styles.successText}>✓ Payment Successful</Text>
            </View>
            <View>
              <Text style={styles.poweredBy}>
                Powered by{" "}
                <Text style={styles.poweredByCompany}>VyaparFlow</Text>
              </Text>
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Main Amount Header */}
            <View style={styles.amountSection}>
              <View>
                <Text style={styles.amountLabel}>Total Paid</Text>
                <Text style={styles.amountValue}>
                  {formatCurrency(data.amount)}
                </Text>
              </View>
              <View style={styles.dateSection}>
                <Text style={styles.dateLabel}>Payment Date</Text>
                <Text style={styles.dateValue}>
                  {format(new Date(data.paymentDate), "MMMM d, yyyy")}
                </Text>
              </View>
            </View>

            {/* Two Columns: From -> To (Company -> Vendor) */}
            <View style={styles.grid}>
              {/* Left Column: From (Company/Payer) */}
              <View style={styles.col}>
                <Text style={styles.sectionTitle}>Paid By</Text>
                <Text style={styles.partyName}>
                  {data.companyName || "Unknown Company"}
                </Text>
                {data.companyEmail && (
                  <Text style={styles.partyDetail}>{data.companyEmail}</Text>
                )}
              </View>

              {/* Right Column: To (Vendor/Payee) */}
              <View style={styles.col}>
                <Text style={styles.sectionTitle}>Paid To</Text>
                <Text style={styles.partyName}>{data.vendorName}</Text>
                <Text style={styles.partyDetail}>{data.vendorEmail}</Text>
                {data.vendorGst && (
                  <Text style={styles.partyDetail}>
                    GSTIN: {data.vendorGst}
                  </Text>
                )}
              </View>
            </View>

            {/* Transaction Details Table */}
            <View style={styles.detailsTable}>
              <View style={[styles.detailRow, { borderTopWidth: 0 }]}>
                <Text style={styles.detailLabel}>Reference ID</Text>
                <Text style={styles.detailValue}>{data.paymentId}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Invoice Number</Text>
                <Text style={styles.detailValue}>#{data.invoiceNumber}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Method</Text>
                <Text style={styles.detailValue}>Online Transfer</Text>
              </View>
              <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.detailLabel}>Transaction Status</Text>
                <Text style={[styles.detailValue, { color: "#059669" }]}>
                  Completed
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This receipt is electronically generated and is valid without a
            signature.{"\n"}
            Generated on {format(new Date(), "PPP")} via VyaparFlow Platform.
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export async function generateReceiptPDF(data: ReceiptData): Promise<Buffer> {
  const stream = await renderToBuffer(<ReceiptDocument data={data} />);
  // @ts-ignore
  return stream;
}
