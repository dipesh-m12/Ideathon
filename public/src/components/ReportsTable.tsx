"use client"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// This would typically come from your backend
const reports = [
  { id: 1, domain: "fake-bank.com", status: "Taken Down", reportDate: "2023-05-01" },
  { id: 2, domain: "not-real-social.com", status: "Under Review", reportDate: "2023-05-02" },
  { id: 3, domain: "scam-site.net", status: "Confirmed Phishing", reportDate: "2023-05-03" },
  { id: 4, domain: "legit-looking-scam.org", status: "Taken Down", reportDate: "2023-05-04" },
]

export default function ReportsTable() {
  return (
    <Table>
      <TableCaption>List of Reported Phishing Domains</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Domain</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Report Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reports.map((report) => (
          <TableRow key={report.id}>
            <TableCell>{report.domain}</TableCell>
            <TableCell>{report.status}</TableCell>
            <TableCell>{report.reportDate}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

