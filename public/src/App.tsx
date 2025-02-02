import PhishingReportForm from "@/components/PhishingReportForm"
import ReportsTable from "@/components/ReportsTable"
import ReportsChart from "@/components/ReportsChart"

export default function Home() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Phishing Domain Reporter</h1>
      <PhishingReportForm />
      <ReportsChart />
      <ReportsTable />
    </div>
  )
}

