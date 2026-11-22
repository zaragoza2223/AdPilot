import { Routes, Route } from "react-router";
import { MainLayout } from "@/layouts/MainLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Channels } from "@/pages/Channels";
import { Campaigns } from "@/pages/Campaigns";
import { CampaignCreate } from "@/pages/CampaignCreate";
import { CampaignDetail } from "@/pages/CampaignDetail";
import { CampaignEdit } from "@/pages/CampaignEdit";
import { Activity } from "@/pages/Activity";
import { AIAssistant } from "@/pages/AIAssistant";

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <MainLayout>
          <Dashboard />
        </MainLayout>
      } />
      <Route path="/channels" element={
        <MainLayout>
          <Channels />
        </MainLayout>
      } />
      <Route path="/campaigns" element={
        <MainLayout>
          <Campaigns />
        </MainLayout>
      } />
      <Route path="/campaigns/create" element={
        <MainLayout>
          <CampaignCreate />
        </MainLayout>
      } />
      <Route path="/campaigns/:id" element={
        <MainLayout>
          <CampaignDetail />
        </MainLayout>
      } />
      <Route path="/campaigns/:id/edit" element={
        <MainLayout>
          <CampaignEdit />
        </MainLayout>
      } />
      <Route path="/ai" element={
        <MainLayout fullHeight>
          <AIAssistant />
        </MainLayout>
      } />
      <Route path="/activity" element={
        <MainLayout>
          <Activity />
        </MainLayout>
      } />
    </Routes>
  );
}

export default App;