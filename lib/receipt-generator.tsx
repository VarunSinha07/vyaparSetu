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
    fontSize: 10,
    color: "#374151",
    flexDirection: "column",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 40,
    backgroundColor: "#f8fafc",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  logo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4f46e5",
    letterSpacing: -1,
  },
  logoSub: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 4,
  },
  receiptBadge: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#cbd5e1",
    letterSpacing: 4,
    textTransform: "uppercase",
  },
  contentContainer: {
    padding: 40,
  },
  statusRow: {
    flexDirection: "row",
    marginBottom: 30,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#dcfce7",
    borderRadius: 4,
  },
  statusText: {
    color: "#166534",
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  grid: {
    flexDirection: "row",
    marginBottom: 40,
    gap: 40,
  },
  col: {
    flex: 1,
  },
  label: {
    color: "#94a3b8",
    fontSize: 9,
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 11,
    color: "#1e293b",
    marginBottom: 12,
    lineHeight: 1.4,
  },
  valueBold: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  table: {
    marginTop: 10,
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderCell: {
    color: "#475569",
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  tableCell: {
    fontSize: 10,
    color: "#334155",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  totalBox: {
    width: 200,
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 8,
    alignItems: "flex-end",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  totalLabel: {
    color: "#64748b",
    fontSize: 9,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4f46e5",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 40,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  footerText: {
    color: "#94a3b8",
    fontSize: 8,
    textAlign: "center",
    lineHeight: 1.5,
  },
});

interface ReceiptData {
  paymentId: string;
  paymentDate: Date;
  invoiceNumber: string;
  amount: number;
  vendorName: string;
  vendorEmail: string;
  vendorGst?: string;
  companyName?: string;
}

const ReceiptDocument = ({ data }: { data: ReceiptData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.logo}>VyaparSetu</Text>
          <Text style={styles.logoSub}>Finance Automation Platform</Text>
        </View>
        <View style={{ justifyContent: "center" }}>
          <Text style={styles.receiptBadge}>RECEIPT</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* Status */}
        <View style={styles.statusRow}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Payment Successful</Text>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.grid}>
          {/* Bill To */}
          <View style={styles.col}>
            <Text style={styles.label}>Paid To</Text>
            <Text style={styles.valueBold}>{data.vendorName}</Text>
            <Text style={styles.value}>{data.vendorEmail}</Text>
            {data.vendorGst && (
              <Text style={styles.value}>GSTIN: {data.vendorGst}</Text>
            )}
          </View>

          {/* Payment Details */}
          <View style={styles.col}>
            <Text style={styles.label}>Transaction Details</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "80%",
              }}
            >
              <View>
                <Text
                  style={{ ...styles.value, color: "#64748b", fontSize: 9 }}
                >
                  Date Paid
                </Text>
                <Text style={{ ...styles.value, marginBottom: 8 }}>
                  {format(data.paymentDate, "dd MMM yyyy")}
                </Text>

                <Text
                  style={{ ...styles.value, color: "#64748b", fontSize: 9 }}
                >
                  Invoice Ref
                </Text>
                <Text style={{ ...styles.value, marginBottom: 8 }}>
                  #{data.invoiceNumber}
                </Text>
              </View>
              <View>
                <Text
                  style={{ ...styles.value, color: "#64748b", fontSize: 9 }}
                >
                  Transaction ID
                </Text>
                <Text
                  style={{
                    ...styles.value,
                    fontFamily: "Helvetica",
                    fontSize: 9,
                  }}
                >
                  {data.paymentId}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Line Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>
              Description
            </Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Reference</Text>
            <Text
              style={[styles.tableHeaderCell, { flex: 1, textAlign: "right" }]}
            >
              Amount
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 2 }]}>
              Payment for Invoice #{data.invoiceNumber}
            </Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>
              {data.invoiceNumber}
            </Text>
            <Text
              style={[
                styles.tableCell,
                { flex: 1, textAlign: "right", fontWeight: "bold" },
              ]}
            >
              {formatCurrency(data.amount)}
            </Text>
          </View>
        </View>

        {/* Total Box */}
        <View style={styles.totalContainer}>
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalAmount}>
              {formatCurrency(data.amount)}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          This receipt is electronically generated and is valid without a
          signature.{"\n"}
          Generated on {format(new Date(), "PPP")} via VyaparSetu Platform.
        </Text>
      </View>
    </Page>
  </Document>
);

export async function generateReceiptPDF(data: ReceiptData): Promise<Buffer> {
  const stream = await renderToBuffer(<ReceiptDocument data={data} />);
  return stream;
}
