# React + Vite UI Rewrite Plan for Skill Gap Analyzer

## 🎯 Executive Summary
Migrate from Streamlit to a modern React frontend with FastAPI backend, enabling better performance, scalability, and user experience while preserving all existing functionality.

## 🏗️ Architecture Overview

### Current: Monolithic Streamlit App
- Python-based UI with embedded analysis logic
- Synchronous processing with spinners
- Direct function calls between components

### Target: React Frontend + FastAPI Backend
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Recharts
- **Backend**: FastAPI with async endpoints and Pydantic models
- **State**: React Query (server) + Zustand (client)
- **API**: RESTful with JSON payloads

## 📅 Implementation Phases (10 weeks)

### Phase 1: Foundation (Weeks 1-2)
- [ ] Setup React + Vite project with TypeScript
- [ ] Configure Tailwind CSS and development tooling
- [ ] Create FastAPI backend structure
- [ ] Migrate data models to Pydantic
- [ ] Build core API endpoints (`/api/analyze`, `/api/jobs`, `/api/skills`)

### Phase 2: Core Components (Weeks 3-5)
- [ ] InputForm component with role-based skill checkboxes
- [ ] Dashboard layout with responsive design
- [ ] Chart components (SkillMatchGauge, GapPriorityChart, SkillBreakdownBar)
- [ ] ReportView with metrics cards and skill categorization
- [ ] Migrate from Plotly to Recharts

### Phase 3: Integration & State (Weeks 6-7)
- [ ] API client layer with Axios and error handling
- [ ] State management (Zustand + React Query)
- [ ] Loading states, error boundaries, and toast notifications
- [ ] Environment configuration and feature flags

### Phase 4: Advanced Features (Weeks 8-9)
- [ ] Resource recommendations UI
- [ ] Data persistence and export functionality
- [ ] Mobile optimization and responsive design
- [ ] Performance optimization (code splitting, lazy loading)

### Phase 5: Testing & Deployment (Week 10)
- [ ] Backend testing (pytest) and frontend testing (Vitest + Playwright)
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Docker containerization and production deployment
- [ ] Monitoring and health checks

## 🔧 Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Recharts for data visualization
- React Query for data fetching
- React Hook Form for form handling

### Backend
- FastAPI with async/await
- Pydantic V2 for data validation
- Existing analysis/scraper modules (migrated)

### DevOps
- Docker for containerization
- Nginx reverse proxy
- PostgreSQL/Redis for data (if needed)

## 📊 API Design

### Core Endpoints
```
POST /api/analyze     # Main gap analysis
GET  /api/jobs        # Job scraping with filters
GET  /api/skills/{role} # Skill frequency data
POST /api/recommend   # Resource recommendations
```

### Data Flow
1. User selects role → Skills checkboxes appear
2. Form submission → POST to `/api/analyze`
3. Backend processes → Returns GapReport
4. Frontend displays results with charts and recommendations

## ⚠️ Risk Assessment

### High Risk
- **Data Loss**: Export existing data before migration
- **Performance**: Implement caching and monitoring

### Medium Risk
- **Chart Migration**: Test visual parity with Plotly → Recharts
- **Type Safety**: Use strict TypeScript and runtime validation

### Low Risk
- **UI Changes**: Design system consistency and user testing
- **Deployment**: Start simple, add complexity incrementally

## ✅ Success Criteria
- [ ] All existing functionality preserved
- [ ] Frontend loads in <3 seconds
- [ ] API responses <2 seconds
- [ ] 80%+ test coverage
- [ ] Mobile-responsive design
- [ ] Zero-downtime deployment

## 🚀 Next Steps
1. Create new `react-ui` branch
2. Initialize Vite + React project
3. Setup FastAPI backend structure
4. Begin Phase 1 implementation

## 📈 Benefits
- **Performance**: Faster loading and better UX
- **Scalability**: API-based architecture supports multiple clients
- **Maintainability**: Clean separation of concerns
- **Developer Experience**: Modern tooling and TypeScript
- **Future-Proof**: Easy to extend and deploy

---

*This plan ensures a smooth migration while maintaining all existing functionality and improving the overall user experience.*</content>
<parameter name="filePath">/home/whysooraj/Documents/carrer_gap/REACT_MIGRATION_PLAN.md