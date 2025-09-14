/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// --- MOCK DATA ---
// In a real application, this data would come from a backend API.
const initialStudents = [
  { id: 1, name: 'Alice Johnson', rollNumber: 'BCA001', course: 'BCA' },
  { id: 2, name: 'Bob Williams', rollNumber: 'BCA002', course: 'BCA' },
  { id: 3, name: 'Charlie Brown', rollNumber: 'BCA003', course: 'BCA' },
];

const initialAttendance = [
    { studentId: 1, date: '2024-07-20', status: 'Present' },
    { studentId: 2, date: '2024-07-20', status: 'Absent' },
    { studentId: 3, date: '2024-07-20', status: 'Present' },
    { studentId: 1, date: '2024-07-21', status: 'Present' },
    { studentId: 2, date: '2024-07-21', status: 'Present' },
    { studentId: 3, date: '2024-07-21', status: 'Absent' },
];
// --- END MOCK DATA ---

const today = new Date().toISOString().split('T')[0];

const PageHeader = ({ title, icon }) => (
    <div className="page-header d-flex align-items-center">
        <i className={`bi ${icon} fs-2 me-3`}></i>
        <h2>{title}</h2>
    </div>
);


const PieChart = ({ data, labels }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new (window as any).Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Attendance',
                    data: data,
                    backgroundColor: ['#28a745', '#dc3545'],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                }
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, labels]);

    return <div className="chart-container"><canvas ref={chartRef}></canvas></div>;
};

const BarChart = ({ data, labels }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new (window as any).Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Attendance Percentage',
                    data: data,
                    backgroundColor: 'rgba(0, 123, 255, 0.5)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: value => `${value}%`
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, labels]);

    return <div className="chart-container"><canvas ref={chartRef}></canvas></div>;
};


const AddStudentPage = ({ students, setStudents }) => {
    const [name, setName] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [course, setCourse] = useState('');
    const [alert, setAlert] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Replace with API call
        const newStudent = { id: Date.now(), name, rollNumber, course };
        setStudents([...students, newStudent]);
        setAlert({ type: 'success', message: 'Student added successfully!' });
        setName('');
        setRollNumber('');
        setCourse('');
        setTimeout(() => setAlert(null), 3000);
    };

    return (
        <>
            <PageHeader title="Add New Student" icon="bi-person-plus-fill" />
            {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}
            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="studentName" className="form-label">Student Name</label>
                            <input type="text" className="form-control" id="studentName" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="rollNumber" className="form-label">Roll Number</label>
                            <input type="text" className="form-control" id="rollNumber" value={rollNumber} onChange={e => setRollNumber(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="course" className="form-label">Course</label>
                            <input type="text" className="form-control" id="course" value={course} onChange={e => setCourse(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Add Student</button>
                    </form>
                </div>
            </div>
        </>
    );
};

const MarkAttendancePage = ({ students, attendance, setAttendance }) => {
    const [date, setDate] = useState(today);
    const [statuses, setStatuses] = useState({});
    const [alert, setAlert] = useState(null);

    const handleStatusChange = (studentId, status) => {
        setStatuses(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Replace with API call
        const newAttendance = Object.entries(statuses).map(([studentId, status]) => ({
            studentId: parseInt(studentId),
            date,
            status
        }));
        
        const remainingAttendance = attendance.filter(att => att.date !== date);
        setAttendance([...remainingAttendance, ...newAttendance]);

        setAlert({type: 'success', message: `Attendance for ${date} saved successfully!`});
        setTimeout(() => setAlert(null), 3000);
    };

    return (
        <>
            <PageHeader title="Mark Attendance" icon="bi-check-circle-fill" />
            {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}
            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="attendanceDate" className="form-label">Select Date</label>
                            <input type="date" className="form-control" id="attendanceDate" value={date} onChange={e => setDate(e.target.value)} />
                        </div>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Roll Number</th>
                                    <th>Student Name</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student.id}>
                                        <td>{student.rollNumber}</td>
                                        <td>{student.name}</td>
                                        <td>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name={`status-${student.id}`} id={`present-${student.id}`} value="Present" onChange={() => handleStatusChange(student.id, 'Present')} required />
                                                <label className="form-check-label" htmlFor={`present-${student.id}`}>Present</label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input className="form-check-input" type="radio" name={`status-${student.id}`} id={`absent-${student.id}`} value="Absent" onChange={() => handleStatusChange(student.id, 'Absent')} />
                                                <label className="form-check-label" htmlFor={`absent-${student.id}`}>Absent</label>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button type="submit" className="btn btn-primary mt-3">Save Attendance</button>
                    </form>
                </div>
            </div>
        </>
    );
};

const ViewAttendancePage = ({ students, attendance }) => {
    const [filterDate, setFilterDate] = useState('');
    const [filterName, setFilterName] = useState('');

    const getStudent = (id) => students.find(s => s.id === id);

    const filteredAttendance = attendance.filter(att => {
        const student = getStudent(att.studentId);
        if (!student) return false;
        const dateMatch = !filterDate || att.date === filterDate;
        const nameMatch = !filterName || student.name.toLowerCase().includes(filterName.toLowerCase());
        return dateMatch && nameMatch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <>
            <PageHeader title="View Attendance Records" icon="bi-table" />
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label htmlFor="filterDate" className="form-label">Filter by Date</label>
                            <input type="date" className="form-control" id="filterDate" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="filterName" className="form-label">Filter by Student Name</label>
                            <input type="text" className="form-control" id="filterName" placeholder="Enter name..." value={filterName} onChange={e => setFilterName(e.target.value)} />
                        </div>
                    </div>
                </div>
            </div>
             <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Roll Number</th>
                                    <th>Student Name</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAttendance.map((att, index) => {
                                    const student = getStudent(att.studentId);
                                    return (
                                        <tr key={index}>
                                            <td>{att.date}</td>
                                            <td>{student?.rollNumber}</td>
                                            <td>{student?.name}</td>
                                            <td>
                                                <span className={`badge ${att.status === 'Present' ? 'bg-success' : 'bg-danger'}`}>{att.status}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};


const StudentViewPage = ({ students, attendance }) => {
    const [rollNumber, setRollNumber] = useState('');
    const [student, setStudent] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        const foundStudent = students.find(s => s.rollNumber.toLowerCase() === rollNumber.toLowerCase());
        if (foundStudent) {
            setStudent(foundStudent);
            setError('');
        } else {
            setStudent(null);
            setError('Student not found.');
        }
    };
    
    const studentAttendance = student ? attendance.filter(att => att.studentId === student.id) : [];
    const presentCount = studentAttendance.filter(att => att.status === 'Present').length;
    const absentCount = studentAttendance.length - presentCount;
    const totalDays = studentAttendance.length;
    const attendancePercentage = totalDays > 0 ? ((presentCount / totalDays) * 100).toFixed(2) : 0;

    return (
        <>
            <PageHeader title="Student Attendance View" icon="bi-person-badge" />
            <div className="card mb-4">
                <div className="card-body">
                    <form onSubmit={handleSearch} className="row g-3 align-items-end">
                        <div className="col-auto flex-grow-1">
                            <label htmlFor="rollNumberSearch" className="form-label">Enter Roll Number</label>
                            <input type="text" className="form-control" id="rollNumberSearch" value={rollNumber} onChange={e => setRollNumber(e.target.value)} placeholder="e.g., BCA001"/>
                        </div>
                        <div className="col-auto">
                            <button type="submit" className="btn btn-primary">Search</button>
                        </div>
                    </form>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            
            {student && (
                <div className="row g-4">
                    <div className="col-lg-6">
                        <div className="card h-100">
                            <div className="card-header">
                                <h5>{student.name}</h5>
                            </div>
                            <div className="card-body">
                                <p><strong>Roll Number:</strong> {student.rollNumber}</p>
                                <p><strong>Course:</strong> {student.course}</p>
                                <p><strong>Overall Attendance:</strong> {attendancePercentage}%</p>
                                <p><strong>Total Days:</strong> {totalDays}</p>
                                <p><strong>Present:</strong> {presentCount}</p>
                                <p><strong>Absent:</strong> {absentCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="card h-100">
                           <div className="card-header"><h5>Attendance Breakdown</h5></div>
                            <div className="card-body">
                                <PieChart data={[presentCount, absentCount]} labels={['Present', 'Absent']} />
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header"><h5>Attendance History</h5></div>
                            <div className="card-body">
                                <div className="table-responsive" style={{maxHeight: '300px'}}>
                                    <table className="table table-sm">
                                        <thead>
                                            <tr><th>Date</th><th>Status</th></tr>
                                        </thead>
                                        <tbody>
                                            {studentAttendance.map((att, i) => (
                                                <tr key={i}>
                                                    <td>{att.date}</td>
                                                    <td><span className={`badge ${att.status === 'Present' ? 'bg-success' : 'bg-danger'}`}>{att.status}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const AnalyticsPage = ({ students, attendance }) => {
    const analyticsData = students.map(student => {
        const studentAttendance = attendance.filter(att => att.studentId === student.id);
        const presentCount = studentAttendance.filter(att => att.status === 'Present').length;
        const totalDays = studentAttendance.length;
        const percentage = totalDays > 0 ? (presentCount / totalDays) * 100 : 0;
        return { name: student.name, percentage };
    });

    const chartLabels = analyticsData.map(d => d.name);
    const chartData = analyticsData.map(d => d.percentage);

    return (
        <>
            <PageHeader title="Class Analytics" icon="bi-bar-chart-line-fill" />
            <div className="card">
                <div className="card-header"><h5>Overall Attendance Percentage</h5></div>
                <div className="card-body">
                    <BarChart data={chartData} labels={chartLabels} />
                </div>
            </div>
        </>
    );
};


const App = () => {
  const [page, setPage] = useState('home');
  const [students, setStudents] = useState(initialStudents);
  const [attendance, setAttendance] = useState(initialAttendance);

  const renderPage = () => {
    switch (page) {
      case 'add-student':
        return <AddStudentPage students={students} setStudents={setStudents} />;
      case 'mark-attendance':
        return <MarkAttendancePage students={students} attendance={attendance} setAttendance={setAttendance} />;
      case 'view-attendance':
        return <ViewAttendancePage students={students} attendance={attendance} />;
      case 'student-view':
        return <StudentViewPage students={students} attendance={attendance} />;
      case 'analytics':
        return <AnalyticsPage students={students} attendance={attendance} />;
      case 'home':
      default:
        return (
            <div>
                <PageHeader title="Dashboard" icon="bi-grid-1x2-fill" />
                <p className="lead mb-4">Welcome to the Attendance Management System. Select an option to get started.</p>
                <div className="row g-4">
                    <div className="col-md-6 col-lg-4">
                        <div className="card text-center h-100" onClick={() => setPage('add-student')} style={{cursor: 'pointer'}}>
                            <div className="card-body">
                                <i className="bi bi-person-plus-fill fs-1 text-primary"></i>
                                <h5 className="card-title mt-3">Add Student</h5>
                                <p className="card-text">Add a new student to the system.</p>
                            </div>
                        </div>
                    </div>
                     <div className="col-md-6 col-lg-4">
                        <div className="card text-center h-100" onClick={() => setPage('mark-attendance')} style={{cursor: 'pointer'}}>
                            <div className="card-body">
                                <i className="bi bi-check-circle-fill fs-1 text-success"></i>
                                <h5 className="card-title mt-3">Mark Attendance</h5>
                                <p className="card-text">Mark daily attendance for all students.</p>
                            </div>
                        </div>
                    </div>
                     <div className="col-md-6 col-lg-4">
                        <div className="card text-center h-100" onClick={() => setPage('view-attendance')} style={{cursor: 'pointer'}}>
                            <div className="card-body">
                                <i className="bi bi-table fs-1 text-info"></i>
                                <h5 className="card-title mt-3">View Records</h5>
                                <p className="card-text">View and filter all attendance records.</p>
                            </div>
                        </div>
                    </div>
                     <div className="col-md-6 col-lg-4">
                        <div className="card text-center h-100" onClick={() => setPage('student-view')} style={{cursor: 'pointer'}}>
                            <div className="card-body">
                                <i className="bi bi-person-badge fs-1 text-warning"></i>
                                <h5 className="card-title mt-3">Student View</h5>
                                <p className="card-text">Check a specific student's attendance.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div className="card text-center h-100" onClick={() => setPage('analytics')} style={{cursor: 'pointer'}}>
                            <div className="card-body">
                                <i className="bi bi-bar-chart-line-fill fs-1 text-danger"></i>
                                <h5 className="card-title mt-3">Analytics</h5>
                                <p className="card-text">View overall class attendance analytics.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#" onClick={(e) => { e.preventDefault(); setPage('home'); }}>
            <i className="bi bi-journal-check me-2"></i>
            Attendance System
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className={`nav-link ${page === 'home' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setPage('home'); }}>Home</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${page === 'add-student' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setPage('add-student'); }}>Add Student</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${page === 'mark-attendance' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setPage('mark-attendance'); }}>Mark Attendance</a>
              </li>
               <li className="nav-item">
                <a className={`nav-link ${page === 'view-attendance' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setPage('view-attendance'); }}>View Records</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${page === 'student-view' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setPage('student-view'); }}>Student View</a>
              </li>
              <li className="nav-item">
                <a className={`nav-link ${page === 'analytics' ? 'active' : ''}`} href="#" onClick={(e) => { e.preventDefault(); setPage('analytics'); }}>Analytics</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main className="container">
        {renderPage()}
      </main>
    </>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
