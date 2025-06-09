import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer.tsx';
import { RequireAuth } from "./components/RequireAuth.tsx";

import { Home } from './pages/Home';
import { Login } from './pages/Authentication/Login.tsx';
import { Register } from './pages/Authentication/Register.tsx';
import { JobSearch } from './pages/job/JobSearch.tsx';
import { CVBuilder } from './pages/candidate/CVBuilder.tsx';
import { CandidateDashboard } from './pages/candidate/CandidateDashboard.tsx';
import { CompanyDashboard } from './pages/company/CompanyDashboard.tsx';

import { JobPost } from './pages/job/JobPost.tsx';
import { UpdateJobPost } from './pages/job/jobedition';
import { CompanyProfile } from './pages/company/CompanyProfile.tsx';
import { CandidateProfileEdition } from './pages/candidate/CandidateProfileEdition.tsx';
import { CompanyProfileCreation } from "./pages/company/CompanyProfileCreation.tsx";
import { CompanyProfileEdition } from "./pages/company/CompanyProfileEdition.tsx";
import {JobDetails} from "./pages/job/JobDetails.tsx";
import {CandidateList} from "./pages/company/CompanyCandidateList.tsx";
import {CandidateSearch} from "./pages/candidate/candidateSearch.tsx";
import {TestCreation} from "./pages/job/TestCreation.tsx";
import {TestResponse} from "./pages/candidate/TestResponse.tsx";
import {Profile} from "./pages/Authentication/Profile.tsx";
import {PasswordReset} from "./pages/Authentication/PasswordReset.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import {CompaniesPage} from "./pages/company/companies.tsx";
import CVBuilderPage from "./pages/candidate/CVBuilderPage.tsx";
import CompanyJobs from "./pages/company/CompanyJobs.tsx";



function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Profile />} />
            <Route path="/reset-password" element={<PasswordReset />} />
            <Route path="*" element={<Navigate to="/account" replace />} />

          <Route path="/company/profile/creation" element={ <RequireAuth><CompanyProfileCreation /></RequireAuth>} />
          <Route path="/company/profile/edition" element={<RequireAuth><CompanyProfileEdition /></RequireAuth>} />
          <Route path="/company/profile" element={<RequireAuth><CompanyProfile /></RequireAuth>} />
          <Route path="/company/:id" element={<RequireAuth><CompanyProfile /></RequireAuth>} />
          <Route path="/company/dashboard" element={<RequireAuth><CompanyDashboard/></RequireAuth>} />
          <Route path="/company/candidate/list/:id" element={<RequireAuth><CandidateList /></RequireAuth>} />
            <Route  path="/company/:id/jobs"  element={<RequireAuth><CompanyJobs/></RequireAuth>} />



            <Route path="/job/post" element={<RequireAuth><JobPost /></RequireAuth>} />
          <Route path="/job/edition/:id" element={<RequireAuth><UpdateJobPost /></RequireAuth>} />
          <Route path="/job/:id" element={<RequireAuth><JobDetails /></RequireAuth>} />
          <Route path="/test/create/:jobId" element={<RequireAuth><TestCreation /></RequireAuth>} />


          <Route path="/jobs" element={<JobSearch />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/candidates" element={<RequireAuth><CandidateSearch /></RequireAuth>} />

          <Route path="/resume" element={<RequireAuth><CVBuilderPage /></RequireAuth>} />
          <Route path="/cv-builder" element={<RequireAuth><CVBuilder /></RequireAuth>} />
          <Route path="/candidate/dashboard" element={<RequireAuth><CandidateDashboard /></RequireAuth>} />

          <Route path="/candidate/profile/edition" element={<RequireAuth><CandidateProfileEdition /></RequireAuth>} />
          <Route path="/test/taker/:jobPostId" element={<RequireAuth><TestResponse /></RequireAuth>} />
          <Route path="/admin/dashboard" element={<JobSearch />} />

          <Route path="/admin" element={<AdminDashboard />} />


        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;