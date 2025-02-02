import PhishingReportForm from "@/components/PhishingReportForm"
import ReportsTable from "@/components/ReportsTable"
import ReportsChart from "@/components/ReportsChart"
import { ThemeProvider } from "./components/theme-provider"
import { ModeToggle } from "./components/ThemeToggle"

export default function Home() {
  return (
    <ThemeProvider>
      <div className="container max-w-4xl mx-auto p-10 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Phishing Domain Reporter</h1>
          <ModeToggle />
        </div>
        <PhishingReportForm />
        <ReportsTable />
        <ReportsChart />
      </div>
    </ThemeProvider>
  )
}

