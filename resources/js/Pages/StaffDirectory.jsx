import React, {useState, useEffect} from 'react';
import PageTitle from '../Components/Reusable/PageTitle';
import FeaturedEvents from '../Components/Reusable/FeaturedEventsWidget/FeaturedEvents';
import WhosOnline from '../Components/Reusable/WhosOnlineWidget/WhosOnline';
import SearchMembers from '../Components/Reusable/StaffDirectorySearchBar';
import DepartmentDropdown from '../Components/Reusable/DropdownStaffDirectory';
import StaffMemberCard from '../Components/Reusable/StaffMemberCard';
import DeactivateModal from '../Components/Reusable/DeactivateModal';
import Header from '../Components/DashboardHeader';
import Sidebar from '../Components/SideNavBar';
import './css/StaffDirectory.css';
import Example from '@/Layouts/DashboardLayoutNew';

const StaffDirectory = () => {
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [isStaffListActive, setStaffListActive] = useState(true);
  const [isOrgChartActive, setOrgChartActive] = useState(false);
  const [activePopupId, setActivePopupId] = useState(null);
  const [activePopupRef, setActivePopupRef] = useState(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  // Getting departments from api
    const fetchDepartments = async (url) => {
        try {
            const response = await fetch(url, {
            method: "GET",
            headers: { Accept: 'application/json' }
            });
            if (!response.ok) {
            throw new Error("Network response was not ok");
            }
            const data = await response.json();
            const departmentData = data.data.data.map((department) => ({
            id: department.id,
            name: department.name
            }));

            // Combine with previous departments and sort alphabetically
            setDepartments((prevDepartments) => {
            const allDepartments = [...prevDepartments, ...departmentData];
            return allDepartments.sort((a, b) => a.name.localeCompare(b.name));
            });

            if (data.data.next_page_url) {
            fetchDepartments(data.data.next_page_url);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

  // Fetch employment posts and user data
  const fetchStaffMembers = async (departmentId) => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch(`/api/department/employment_posts?filter[0][where][0]=department_id&filter[0][where][1]=${departmentId}`, {
        method: "GET",
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const employmentPosts = data.data.data;

      const userPromises = employmentPosts.map(post =>
        fetch(`/api/crud/users/${post.user_id}`, {
          method: "GET",
          headers: { Accept: 'application/json' }
        }).then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        }).then(userData => {
          console.log('User Data for user_id', post.user_id, ':', userData);
          return { userData, title: post.title };
        })
      );

      const users = await Promise.all(userPromises);

      const members = users.map(({ userData, title }) => ({
        id: userData.data.id,
        name: userData.data.name,
        role: title,
        status: 'Online',
        imageUrl: '/assets/dummyStaffPlaceHolder.jpg',
        phoneNo: ' ',
        isDeactivated: false
      }));

      console.log('Members:', members);

      setStaffMembers(members);
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false); // End loading
  };

  useEffect(() => {
    fetchDepartments("/api/department/departments");
  }, []);

  useEffect(() => {
    if (selectedDepartmentId) {
      fetchStaffMembers(selectedDepartmentId);
    }
  }, [selectedDepartmentId]);

  // console.log(staffMembers);

  // Dummy departments
  // const departments = [
  //   'Some Department 1',
  //   'Some Department 2',
  //   'Some Department 3',
  //   'Some Department 4',
  //   'Some Department 5',
  //   'Some Department 6',
  //   'Some Department 7',
  // ];

  // Dummy staff members
  // const [staffMembers, setStaffMembers] = useState([
  //   {
  //     id: 1,
  //     name: 'Mr Asyraf Jalil',
  //     role: 'Design and Development Lead',
  //     status: 'Online',
  //     imageUrl: '/assets/dummyImage1.jpg',
  //     phoneNo: '+60175165175',
  //     isDeactivated: false
  //   },
  //   {
  //     id: 2,
  //     name: 'Nor Rahimah Binti Ariffin',
  //     role: 'Setiausaha Pejabat',
  //     status: 'Offline',
  //     imageUrl: '/assets/dummyImage2.png',
  //     phoneNo: '',
  //     isDeactivated: false
  //   },
  //   {
  //     id: 3,
  //     name: 'Eduzar Zar Bin Ayob Azari',
  //     role: 'Timbalan Pengarah Kanan',
  //     status: 'Away',
  //     imageUrl: '/assets/dummyImage3.png',
  //     phoneNo: '',
  //     isDeactivated: false
  //   },
  //   {
  //     id: 4,
  //     name: 'Hishamuddin Mustafa',
  //     role: 'Pengarah Kanan',
  //     status: 'Online',
  //     imageUrl: '/assets/dummyImage4.png',
  //     phoneNo: '',
  //     isDeactivated: false
  //   },
  //   {
  //     id: 5,
  //     name: 'Iskander Mirza',
  //     role: 'Pengarah Kanan',
  //     status: 'Online',
  //     imageUrl: '/assets/dummyImage5.png',
  //     phoneNo: '',
  //     isDeactivated: false
  //   },
  //   {
  //     id: 6,
  //     name: 'Nor Rahimah Binti Ariffin',
  //     role: 'Setiausaha Pejabat',
  //     status: 'Offline',
  //     imageUrl: '/assets/dummyImage6.png',
  //     phoneNo: '',
  //     isDeactivated: false
  //   },
  //   {
  //     id: 7,
  //     name: 'Eduzar Zar Bin Ayob Azari',
  //     role: 'Timbalan Pengarah Kanan',
  //     status: 'Away',
  //     imageUrl: '/assets/dummyImage7.png',
  //     phoneNo: '',
  //     isDeactivated: false
  //   },
  //   {
  //     id: 8,
  //     name: 'Hishamuddin Mustafa',
  //     role: 'Pengarah Kanan',
  //     status: 'Online',
  //     imageUrl: '/assets/dummyImage8.png',
  //     phoneNo: '',
  //     isDeactivated: false
  //   },
  //   {
  //     id: 9,
  //     name: 'Iskander Mirza',
  //     role: 'Pengarah Kanan',
  //     status: 'Online',
  //     imageUrl: '/assets/dummyStaffImage.png',
  //     phoneNo: '',
  //     isDeactivated: false
  //   },
  //   {
  //     id: 10,
  //     name: 'Nor Rahimah Binti Ariffin',
  //     role: 'Setiausaha Pejabat',
  //     status: 'Offline',
  //     imageUrl: '/assets/dummyImage2.png',
  //     phoneNo: '',
  //     isDeactivated: false
  //   },
  //   {
  //     id: 11,
  //     name: 'Eduzar Zar Bin Ayob Azari',
  //     role: 'Timbalan Pengarah Kanan',
  //     status: 'Away',
  //     imageUrl: '/assets/dummyImage3.png',
  //     phoneNo: '',
  //     isDeactivated: false
  //   },
  //   {
  //     id: 12,
  //     name: 'Hishamuddin Mustafa',
  //     role: 'Pengarah Kanan',
  //     status: 'Online',
  //     imageUrl: '/assets/dummyImage4.png',
  //     phoneNo: '',
  //     isDeactivated: false
  //   },
  //   {
  //     id: 13,
  //     name: 'Iskander Mirza',
  //     role: 'Pengarah Kanan',
  //     status: 'Online',
  //     imageUrl: '/assets/dummyImage5.png',
  //     phoneNo: '',
  //     isDeactivated: false
  //   },
  //   {
  //     id: 14,
  //     name: 'Nor Rahimah Binti Ariffin',
  //     role: 'Setiausaha Pejabat',
  //     status: 'Offline',
  //     imageUrl: '/assets/dummyImage6.png',
  //     phoneNo: '',
  //     isDeactivated: false
  //   },
  //   {
  //     id: 15,
  //     name: 'Eduzar Zar Bin Ayob Azari',
  //     role: 'Timbalan Pengarah Kanan',
  //     status: 'Away',
  //     imageUrl: '/assets/dummyImage7.png',
  //     phoneNo: '',
  //     isDeactivated: false
  //   },
  //   {
  //     id: 16,
  //     name: 'Hishamuddin Mustafa',
  //     role: 'Pengarah Kanan',
  //     status: 'Online',
  //     imageUrl: '/assets/dummyImage8.png',
  //     phoneNo: '',
  //     isDeactivated: false
  //   },

  // ]);

  const handleOutsideClick = (event) => {
    if (activePopupRef && !activePopupRef.contains(event.target)) {
      setActivePopupId(null);
      setActivePopupRef(null);
    }
  };

  useEffect(() => {
    if (activePopupRef) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [activePopupRef]);

  const handleSelectDepartment = (departmentId) => {
    setSelectedDepartmentId(departmentId);
  };

  const handleStaffListButton = () => {
    setStaffListActive(true);
    setOrgChartActive(false);
  }

  const handleOrgChartButton = () => {
    setStaffListActive(false);
    setOrgChartActive(true);
  }

  const handleDeactivateClick = (id) => {
    setCurrentMemberId(id);
    setIsDeactivateModalOpen(true);
  };

  const handleActivateClick = (id) => {
    setCurrentMemberId(id);
    setIsActivateModalOpen(true);
  };

  const handleDeactivate = () => {
    setStaffMembers(staffMembers.map(member =>
      member.id === currentMemberId ? { ...member, isDeactivated: true } : member
    ));
    setIsDeactivateModalOpen(false);
  };

  const handleActivate = () => {
    setStaffMembers(staffMembers.map(member =>
      member.id === currentMemberId ? { ...member, isDeactivated: false } : member
    ));
    setIsActivateModalOpen(false);
  };

return (
  <Example>
    <div className="flex-row">
      <div className="flex ">
        <main className="w-full xl:pl-96">
          <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
            <SearchMembers {...{ handleStaffListButton, handleOrgChartButton, isStaffListActive, isOrgChartActive }} />
            <DepartmentDropdown
              departments={departments}
              onSelectDepartment={handleSelectDepartment}
            />
              {isLoading ? (
                <div className="staff-member-grid-container max-w-[1200px]">
                  <div className="mt-20 ml-32 loading-spinner"></div>
                </div>
              ) : (
                <div className="staff-member-grid-container max-w-[1200px]">
                  {staffMembers.map((member) => (
                    <StaffMemberCard
                      key={member.id}
                      name={member.name}
                      role={member.role}
                      status={member.status}
                      imageUrl={member.imageUrl}
                      phoneNo={member.phoneNo}
                      isDeactivated={member.isDeactivated}
                      onDeactivateClick={() => handleDeactivateClick(member.id)}
                      onActivateClick={() => handleActivateClick(member.id)}
                      isPopupOpen={activePopupId === member.id}
                      setActivePopup={() => {
                        setActivePopupId(member.id);
                        setActivePopupRef(document.getElementById(`staff-popup-${member.id}`));
                      }}
                      closePopup={() => {
                        setActivePopupId(null);
                        setActivePopupRef(null);
                      }}
                    />
                  ))}
                </div>
              )}
          </div>
        </main>
        <aside className="fixed bottom-0 hidden px-4 py-6 overflow-y-auto border-r border-gray-200 left-20 top-16 w-96 sm:px-6 lg:px-8 xl:block">
          <style>
            {`
              aside::-webkit-scrollbar {
                width: 0px;
                background: transparent;
              }
            `}
          </style>
          <div className="file-directory-header">
            <PageTitle title="Staff Directory" />
          </div>
          <hr className="file-directory-underline" />
          <div>
            <FeaturedEvents />
            <WhosOnline />
          </div>
        </aside>
      </div>
    </div>
    {isDeactivateModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm">
        <div className="relative p-8 bg-white rounded-lg shadow-lg w-96">
          <h2 className="mb-4 text-xl font-bold text-center">Deactivate?</h2>
          <div className="flex justify-center space-x-4">
            <button className="px-8 py-1 text-white font-bold bg-[#4880FF] rounded-full" onClick={handleDeactivate}>
              Yes
            </button>
            <button className="px-8 py-1 text-base font-bold text-[#979797] bg-white rounded-full border border-[#BDBDBD]" onClick={() => setIsDeactivateModalOpen(false)}>
              No
            </button>
          </div>
        </div>
      </div>
    )}
    {isActivateModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm">
        <div className="relative p-8 bg-white rounded-lg shadow-lg w-96">
          <h2 className="mb-4 text-xl font-bold text-center">Activate?</h2>
          <div className="flex justify-center space-x-4">
            <button className="px-8 py-1 text-white font-bold bg-[#4880FF] rounded-full" onClick={handleActivate}>
              Yes
            </button>
            <button className="px-8 py-1 text-base font-bold text-[#979797] bg-white rounded-full border border-[#BDBDBD]" onClick={() => setIsActivateModalOpen(false)}>
              No
            </button>
          </div>
        </div>
      </div>
    )}
  </Example>
);
};

export default StaffDirectory;
