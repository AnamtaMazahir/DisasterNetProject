import { BrowserRouter as Router, Routes, Route } from "react-router";
import { ThemeProvider } from "@/react-app/hooks/useTheme";
import Layout from "@/react-app/components/Layout";
import Dashboard from "@/react-app/pages/Dashboard";
import Upload from "@/react-app/pages/Upload";
import MapView from "@/react-app/pages/MapView";
import Reports from "@/react-app/pages/Reports";
import RescuePlanning from "@/react-app/pages/RescuePlanning";
import EvacuationCenter from "@/react-app/pages/EvacuationCenter";
import SOSCenter from "@/react-app/pages/SOSCenter";
import SOSRequest from "@/react-app/pages/SOSRequest";
import SOSSubmitted from "@/react-app/pages/SOSSubmitted";
import EmergencyContacts from "@/react-app/pages/EmergencyContacts";
import Donation from "@/react-app/pages/Donation";

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/sos" element={<SOSCenter />} />
            <Route path="/sos/request" element={<SOSRequest />} />
            <Route path="/sos/submitted" element={<SOSSubmitted />} />
            <Route path="/emergency-contacts" element={<EmergencyContacts />} />
            <Route path="/rescue-planning" element={<RescuePlanning />} />
            <Route path="/evacuation" element={<EvacuationCenter />} />
            <Route path="/donation" element={<Donation />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}
