import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Authentication/Login.tsx';
import { Register } from './pages/Authentication/Register.tsx';
import { JobSearch } from './pages/JobSearch';
import { CVBuilder } from './pages/candidate/CVBuilder.tsx';
import { CandidateDashboard } from './pages/CandidateDashboard';
import { CompanyDashboard } from './pages/company/CompanyDashboard.tsx';
import { SkillAssessment } from './pages/SkillAssessment';
import { JobPost } from './pages/job/JobPost.tsx';
import { UpdateJobPost } from './pages/job/jobedition';
import { CompanyProfile } from './pages/company/CompanyProfile.tsx';
import { CandidateProfileEdition } from './pages/candidate/CandidateProfileEdition.tsx';
import { CompanyProfileCreation } from "./pages/company/CompanyProfileCreation.tsx";
import { CompanyProfileEdition } from "./pages/company/CompanyProfileEdition.tsx";
import {JobDetails} from "./pages/job/JobDetails.tsx";
import {CandidateList} from "./pages/company/CompanyCandidateList.tsx";


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/company/profile/creation" element={<CompanyProfileCreation />} />
          <Route path="/company/profile/edition" element={<CompanyProfileEdition />} />
          <Route path="/company/profile" element={<CompanyProfile />} />
          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/company/candidate/list" element={<CandidateList />} />

          <Route path="/job/post" element={<JobPost />} />
          <Route path="/job/edition/:id" element={<UpdateJobPost />} />
          <Route path="/job/:id" element={<JobDetails />} />

          <Route path="/jobs" element={<JobSearch />} />
          <Route path="/cv-builder" element={<CVBuilder />} />
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="/skills-assessment" element={<SkillAssessment />} />

          <Route path="/candidate/profile/edition" element={<CandidateProfileEdition />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;