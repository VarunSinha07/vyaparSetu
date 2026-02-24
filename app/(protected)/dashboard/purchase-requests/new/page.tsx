"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  Save,
  Send,
  IndianRupee,
  Calendar,
  Package,
  UploadCloud,
  Paperclip,
  Trash2,
  FileText,
  AlertCircle,
  CheckCircle2,
  Building,
  Briefcase,
  Layers,
  Info,
} from "lucide-react";
import { Vendor } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function NewPurchaseRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    priority: "NORMAL",
    requiredBy: "",
    itemName: "",
    quantity: "",
    unitPrice: "",
    description: "",
    budgetCategory: "",
    preferredVendorId: "",
  });

  const [attachments, setAttachments] = useState<File[]>([]);

  // Calculate total estimated cost automatically
  const totalEstimatedCost =
    (parseFloat(formData.quantity) || 0) *
    (parseFloat(formData.unitPrice) || 0);

  useEffect(() => {
    fetch("/api/vendors")
      .then((res) => res.json())
      .then((data) => setVendors(data))
      .catch((err) => console.error("Failed to load vendors", err));
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
      toast.success("File added (mock upload)");
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.requiredBy) newErrors.requiredBy = "Date is required";
    if (!formData.itemName.trim()) newErrors.itemName = "Item name is required";
    if (!formData.quantity || parseFloat(formData.quantity) <= 0)
      newErrors.quantity = "Valid quantity required";
    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0)
      newErrors.unitPrice = "Valid price required";
    if (!formData.description.trim())
      newErrors.description = "Justification is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (submitForApproval: boolean) => {
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/purchase-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity),
          unitPrice: parseFloat(formData.unitPrice),
          estimatedCost: totalEstimatedCost,
          status: submitForApproval ? "SUBMITTED" : "DRAFT",
          attachments: attachments.map((f) => f.name),
        }),
      });

      if (!res.ok) throw new Error("Failed to create request");

      toast.success(
        submitForApproval
          ? "Purchase request submitted for approval"
          : "Draft saved successfully",
      );
      router.push("/dashboard/purchase-requests");
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pt-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-xl bg-white border-gray-200 hover:bg-gray-50 hover:text-emerald-600 transition-colors"
            asChild
          >
            <Link href="/dashboard/purchase-requests">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              New Purchase Request
            </h1>
            <p className="text-gray-500 text-sm">
              Create a new requisition request for approval.
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-emerald-50/50 px-3 py-1.5 rounded-lg border border-emerald-100">
          <Info className="w-4 h-4 text-emerald-600" />
          <span>
            Fields marked with <span className="text-red-500">*</span> are
            mandatory
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: General Information */}
          <Card className="border-gray-200 shadow-sm overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-emerald-600" />
                General Information
              </CardTitle>
              <CardDescription>
                Basic details about the request origin and urgency.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Purchase Title <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="title"
                    placeholder="e.g. Q3 Office Supplies Restock"
                    className={`pl-10 h-11 ${errors.title ? "border-red-300 focus-visible:ring-red-200" : ""}`}
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                  <Layers className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                {errors.title && (
                  <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors.title}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>
                    Department <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      handleInputChange("department", value)
                    }
                  >
                    <SelectTrigger
                      className={`h-11 ${errors.department ? "border-red-300 focus:ring-red-200" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        <SelectValue placeholder="Select Department" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IT">IT & Engineering</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Admin">Administration</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.department && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.department}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>
                    Priority <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      handleInputChange("priority", value)
                    }
                  >
                    <SelectTrigger className="h-11">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${formData.priority === "URGENT" ? "bg-red-500" : "bg-emerald-500"}`}
                        ></div>
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NORMAL">Normal</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requiredBy">
                  Expected By <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="requiredBy"
                    type="date"
                    className={`pl-10 h-11 ${errors.requiredBy ? "border-red-300 focus-visible:ring-red-200" : ""}`}
                    value={formData.requiredBy}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      handleInputChange("requiredBy", e.target.value)
                    }
                  />
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                </div>
                {errors.requiredBy && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.requiredBy}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Item Details */}
          <Card className="border-gray-200 shadow-sm overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-teal-500 to-cyan-500"></div>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="w-5 h-5 text-teal-600" />
                Items & Costs
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="itemName">
                  Item Description / Name{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="itemName"
                  placeholder="What do you need to purchase?"
                  className={`h-11 ${errors.itemName ? "border-red-300 focus-visible:ring-red-200" : ""}`}
                  value={formData.itemName}
                  onChange={(e) =>
                    handleInputChange("itemName", e.target.value)
                  }
                />
                {errors.itemName && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.itemName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="quantity">
                    Quantity <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    placeholder="0"
                    className={`h-11 ${errors.quantity ? "border-red-300 focus-visible:ring-red-200" : ""}`}
                    value={formData.quantity}
                    onChange={(e) =>
                      handleInputChange("quantity", e.target.value)
                    }
                  />
                  {errors.quantity && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.quantity}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unitPrice">
                    Est. Unit Price (₹) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="unitPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className={`pl-8 h-11 ${errors.unitPrice ? "border-red-300 focus-visible:ring-red-200" : ""}`}
                      value={formData.unitPrice}
                      onChange={(e) =>
                        handleInputChange("unitPrice", e.target.value)
                      }
                    />
                    <span className="absolute left-3 top-3 text-gray-500 font-semibold">
                      ₹
                    </span>
                  </div>
                  {errors.unitPrice && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.unitPrice}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Justification & Details */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Briefcase className="w-5 h-5 text-gray-600" />
                Business Justification
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="description">
                  Reason for Purchase <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Explain the business need for this purchase..."
                  className={`resize-none ${errors.description ? "border-red-300 focus-visible:ring-red-200" : ""}`}
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
                {errors.description && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Budget Category</Label>
                  <Select
                    value={formData.budgetCategory}
                    onValueChange={(value) =>
                      handleInputChange("budgetCategory", value)
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Optional" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CAPEX">
                        CapEx (Capital Expenditure)
                      </SelectItem>
                      <SelectItem value="OPEX">
                        OpEx (Operating Expenditure)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Vendor</Label>
                  <Select
                    value={formData.preferredVendorId}
                    onValueChange={(value) =>
                      handleInputChange("preferredVendorId", value)
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select Vendor (Optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.length === 0 ? (
                        <div className="p-2 text-sm text-gray-500 text-center">
                          No vendors found
                        </div>
                      ) : (
                        vendors.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Attachments */}
          <Card className="border-gray-200 shadow-sm bg-gray-50/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Paperclip className="w-5 h-5 text-gray-600" />
                Attachments
              </CardTitle>
              <CardDescription>
                Upload quotes, specs, or invoices.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:bg-white transition-all text-center cursor-pointer relative group bg-white">
                <input
                  type="file"
                  multiple
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center gap-3 group-hover:scale-105 transition-transform duration-300">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full ring-4 ring-emerald-50/30">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Click to upload or drag files here
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Support for PDF, Images, Excel
                    </p>
                  </div>
                </div>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2 mt-4">
                  {attachments.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded text-gray-500">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                            {file.name}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                        onClick={() => removeAttachment(idx)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Summary Area - Sticky */}
        <div className="lg:col-span-4">
          <div className="sticky top-6 space-y-6">
            <Card className="border-emerald-100 shadow-lg shadow-emerald-500/5 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-100/50 to-teal-100/50 rounded-bl-[100px] -mr-10 -mt-10 pointer-events-none"></div>
              <CardHeader className="pb-4 relative z-10">
                <CardTitle className="text-gray-900">Summary</CardTitle>
                <CardDescription>
                  Review cost estimation before submitting.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 space-y-6">
                <div className="space-y-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Estimated Total
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{totalEstimatedCost.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">
                      INR
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Department</span>
                    <span className="font-medium text-gray-900 text-right">
                      {formData.department || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Urgency</span>
                    <span
                      className={`font-semibold ${formData.priority === "URGENT" ? "text-red-600" : "text-emerald-600"}`}
                    >
                      {formData.priority}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Vendor</span>
                    <span className="font-medium text-gray-900 truncate max-w-[120px] text-right">
                      {formData.preferredVendorId
                        ? vendors.find(
                            (v) => v.id === formData.preferredVendorId,
                          )?.name
                        : "Market"}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-3">
                  <Button
                    onClick={() => handleSubmit(true)}
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-200 text-lg font-semibold"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Submit Request <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSubmit(false)}
                    disabled={loading}
                    className="w-full text-gray-600"
                  >
                    <Save className="w-4 h-4 mr-2" /> Save Draft
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 leading-relaxed">
                <strong>Validation Policy:</strong> Requests above ₹50,000
                require VP approval. Ensure budget codes are correct to avoid
                delays.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
