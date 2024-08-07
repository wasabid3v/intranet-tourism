// import React, { useState, useEffect, useRef } from 'react';
// import PopupContent from '../Reusable/PopupContent';
// import Pagination from '../Paginator';
// import { useCsrf } from "@/composables";

// const excludedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp'];

// const FileTable = ({ searchTerm }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [editingName, setEditingName] = useState("");
//   const csrfToken = useCsrf();
//   const inputRef = useRef(null);

//   const fetchFiles = async () => {
//     try {
//       const response = await fetch('/api/resources/resources');
//       if (!response.ok) {
//         throw new Error('Failed to fetch files');
//       }
//       const responseData = await response.json();

//       if (!Array.isArray(responseData.data?.data)) {
//         console.error('Expected an array of files, but received:', responseData.data?.data);
//         setLoading(false);
//         return;
//       }

//       const filesData = responseData.data.data.map(file => ({
//         ...file,
//         uploader: file.uploader, // Assuming the API provides an 'uploader' field with the uploader's name
//         metadata: typeof file.metadata === 'string' ? JSON.parse(file.metadata) : file.metadata
//       }));

//       setFiles(filesData);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching files:', error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFiles();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (inputRef.current && !inputRef.current.contains(event.target)) {
//         setEditingIndex(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // Filter files based on search term and exclude media files
//   const filteredFiles = files.filter(file => {
//     const metadata = file.metadata || {};
//     const fileExtension = metadata.extension ? metadata.extension.toLowerCase() : '';
//     const fileName = metadata.original_name ? metadata.original_name.toLowerCase() : '';

//     // Check if file extension is in the excluded list
//     const isExcluded = excludedExtensions.includes(fileExtension);

//     // Return true if not excluded and if name matches search term
//     return !isExcluded && fileName.includes(searchTerm.toLowerCase());
//   });

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredFiles.slice(indexOfFirstItem, indexOfLastItem);

//   const handleRename = async (index, newName) => {
//     const fileToRename = files[index];
//     if (!fileToRename || !fileToRename.id) {
//       console.error("File ID is missing.");
//       return;
//     }

//     const userId = String(fileToRename.user_id);
//     const updatedMetadata = {
//       ...fileToRename.metadata,
//       original_name: newName
//     };
//     const metadataString = JSON.stringify(updatedMetadata);

//     const payload = {
//       user_id: userId,
//       attachable_id: fileToRename.attachable_id,
//       attachable_type: fileToRename.attachable_type,
//       extension: fileToRename.extension,
//       filesize: fileToRename.filesize,
//       for: fileToRename.for,
//       metadata: metadataString,
//       mime_type: fileToRename.mime_type,
//       path: fileToRename.path,
//     };

//     const url = `/api/crud/resources/${fileToRename.id}`;
//     const options = {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//         'X-CSRF-Token': csrfToken,
//       },
//       body: JSON.stringify(payload),
//     };

//     try {
//       const response = await fetch(url, options);
//       if (!response.ok) {
//         const responseBody = await response.text();
//         console.error('Failed to rename file:', responseBody);
//         throw new Error(`Failed to rename file: ${response.statusText}`);
//       }

//       console.log('File renamed successfully.');
      
//       // Refresh the file list to get the updated name
//       await fetchFiles();

//     } catch (error) {
//       console.error('Error renaming file:', error);
//     } finally {
//       setEditingIndex(null);
//     }
//   };

//   const handleDelete = async (fileId, index) => {
//     const url = `/api/crud/resources/${fileId}`;
//     const options = {
//       method: 'DELETE',
//       headers: { Accept: "application/json", "X-CSRF-Token": csrfToken },
//     };

//     try {
//       const response = await fetch(url, options);
//       const data = await response.json();
//       console.log('Delete response:', data);

//       // Remove the file from the state only if the deletion was successful
//       if (response.ok) {
//         const updatedFiles = files.filter((_, i) => i !== index);
//         setFiles(updatedFiles);
//       } else {
//         console.error('Failed to delete file:', data);
//       }
//     } catch (error) {
//       console.error('Error deleting file:', error);
//     }
//   };

//   const startEditing = (index, currentName) => {
//     setEditingIndex(index);
//     setEditingName(currentName);
//   };

//   const saveEditing = (index) => {
//     handleRename(index, editingName);
//   };

//   return (
//     <div className="w-full px-4 overflow-visible sm:px-0 lg:px-0">
//       <div className="flow-root mt-8">
//         <div className="overflow-visible">
//           <div className="w-full h-[715px] px-8 py-8 rounded-2xl shadow-custom overflow-visible bg-white">
//             <table className="w-full bg-white border-separate table-fixed rounded-2xl border-spacing-1">
//               <thead>
//                 <tr>
//                   <th className="w-1/3 md:w-1/2 lg:w-2/4 rounded-full bg-blue-200 px-3 py-3.5 text-center text-sm font-semibold text-blue-500 sm:pl-1 shadow-custom">Name</th>
//                   <th className="w-1/6 md:w-1/10 lg:w-1/10 rounded-full bg-blue-200 px-3 py-3.5 text-center text-sm font-semibold text-blue-500 shadow-custom">Uploaded By</th>
//                   <th className="w-1/6 md:w-1/10 lg:w-1/10 rounded-full bg-blue-200 px-3 py-3.5 text-center text-sm font-semibold text-blue-500 shadow-custom">Date Created</th>
//                   <th className="w-1/12 relative py-3.5 pl-3 pr-4 sm:pl-3"><span className="sr-only">Edit</span></th>
//                 </tr>
//               </thead>
//               <tbody className="text-center divide-y-reverse rounded-full divide-neutral-300">
//                 {currentItems.map((item, index) => {
//                   const metadata = item.metadata || {};
//                   const isEditing = editingIndex === indexOfFirstItem + index;

//                   return (
//                     <tr key={index}>
//                       <td className="border-b border-r border-neutral-300 whitespace-nowrap px-3 py-4 text-sm text-neutral-800 sm:pl-1 overflow-hidden text-ellipsis">
//                         {isEditing ? (
//                           <div ref={inputRef} className="flex items-center">
//                             <input
//                               type="text"
//                               value={editingName}
//                               onChange={(e) => setEditingName(e.target.value)}
//                               className="text-sm text-neutral-800 text-opacity-80 mt-1 block w-full rounded-full p-2 border-2 border-stone-300 max-md:ml-4"
//                             />
//                             <button
//                               onClick={() => saveEditing(indexOfFirstItem + index)}
//                               className="ml-2 text-sm text-blue-500"
//                             >
//                               Save
//                             </button>
//                           </div>
//                         ) : (
//                           <div
//                             className="text-sm mt-1 block w-full rounded-md p-2 border-2 border-transparent text-neutral-800 text-opacity-80"
//                             onDoubleClick={() => startEditing(indexOfFirstItem + index, metadata.original_name)}
//                           >
//                             {metadata.original_name || 'Unknown'}
//                           </div>
//                         )}
//                       </td>
//                       <td className="px-3 py-4 overflow-hidden text-sm border-b border-r border-neutral-300 whitespace-nowrap text-neutral-800 text-ellipsis">
//                         {item.uploader || 'Unknown'} {/* Display 'Unknown' if uploader is not provided */}
//                       </td>
//                       <td className="px-3 py-4 overflow-hidden text-sm border-b border-r border-neutral-300 whitespace-nowrap text-neutral-800 text-ellipsis">
//                         {new Date(item.created_at).toLocaleDateString()}
//                       </td>
//                       <td className="flex relative mt-3.5">
//                         <PopupContent
//                           name={metadata.original_name}
//                           handleDelete={() => handleDelete(item.id, index)}
//                         />
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <div className="mt-8 flex justify-center">
//           <Pagination
//             currentPage={currentPage}
//             totalItems={filteredFiles.length}
//             itemsPerPage={itemsPerPage}
//             onPageChange={setCurrentPage}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FileTable;
import React, { useState, useEffect, useRef } from 'react';
import PopupContent from '../Reusable/PopupContent';
import Pagination from '../Paginator';
import { useCsrf } from "@/composables";

const excludedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp'];

const FileTable = ({ searchTerm }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // For managing admin
  const csrfToken = useCsrf();
  const inputRef = useRef(null);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/resources/resources?with[]=author');
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      const responseData = await response.json();
      console.log("RESPONSEDATA", responseData);
      
      if (!Array.isArray(responseData.data?.data)) {
        console.error('Expected an array of files, but received:', responseData.data?.data);
        setLoading(false);
        return;
      }

      const filesData = responseData.data.data.map(file => ({
        ...file,
        uploader: file.author.name, // Assuming the API provides an 'uploader' field with the uploader's name
        metadata: typeof file.metadata === 'string' ? JSON.parse(file.metadata) : file.metadata
      }));

      setFiles(filesData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching files:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setEditingIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredFiles = files.filter(file => {
    const metadata = file.metadata || {};
    const fileExtension = metadata.extension ? metadata.extension.toLowerCase() : '';
    const fileName = metadata.original_name ? metadata.original_name.toLowerCase() : '';

    const isExcluded = excludedExtensions.includes(fileExtension);

    return !isExcluded && fileName.includes(searchTerm.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFiles.slice(indexOfFirstItem, indexOfLastItem);

  const handleRename = async (index, newName) => {
    const fileToRename = files[index];
    if (!fileToRename || !fileToRename.id) {
      console.error("File ID is missing.");
      return;
    }

    const userId = String(fileToRename.user_id);
    const updatedMetadata = {
      ...fileToRename.metadata,
      original_name: newName
    };
    const metadataString = JSON.stringify(updatedMetadata);

    const payload = {
      user_id: userId,
      attachable_id: fileToRename.attachable_id,
      attachable_type: fileToRename.attachable_type,
      extension: fileToRename.extension,
      filesize: fileToRename.filesize,
      for: fileToRename.for,
      metadata: metadataString,
      mime_type: fileToRename.mime_type,
      path: fileToRename.path,
    };

    const url = `/api/crud/resources/${fileToRename.id}`;
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify(payload),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const responseBody = await response.text();
        console.error('Failed to rename file:', responseBody);
        throw new Error(`Failed to rename file: ${response.statusText}`);
      }

      console.log('File renamed successfully.');
      await fetchFiles();

    } catch (error) {
      console.error('Error renaming file:', error);
    } finally {
      setEditingIndex(null);
    }
  };

  const handleDelete = async (fileId, index) => {
    const url = `/api/crud/resources/${fileId}`;
    const options = {
      method: 'DELETE',
      headers: { Accept: "application/json", "X-CSRF-Token": csrfToken },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log('Delete response:', data);

      if (response.ok) {
        const updatedFiles = files.filter((_, i) => i !== index);
        setFiles(updatedFiles);
        // window.location.reload(); // Reload the page
      } else {
        console.error('Failed to delete file:', data);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const startEditing = (index, currentName) => {
    setEditingIndex(index);
    setEditingName(currentName);
  };

  const saveEditing = (index) => {
    handleRename(index, editingName);
  };

  return (
    <div className="w-full px-4 overflow-visible sm:px-0 lg:px-0">
      <div className="flow-root mt-8">
        <div className="overflow-visible">
          <div className="w-full h-[715px] px-8 py-8 rounded-2xl shadow-custom overflow-visible bg-white">
            <table className="w-full bg-white border-separate table-fixed rounded-2xl border-spacing-1">
              <thead>
                <tr>
                  <th className="w-1/3 md:w-1/2 lg:w-2/4 rounded-full bg-blue-200 px-3 py-3.5 text-center text-sm font-semibold text-blue-500 sm:pl-1 shadow-custom">Name</th>
                  <th className="w-1/6 md:w-1/10 lg:w-1/10 rounded-full bg-blue-200 px-3 py-3.5 text-center text-sm font-semibold text-blue-500 shadow-custom">Uploaded By</th>
                  <th className="w-1/6 md:w-1/10 lg:w-1/10 rounded-full bg-blue-200 px-3 py-3.5 text-center text-sm font-semibold text-blue-500 shadow-custom">Date Created</th>
                  <th className="w-1/12 relative py-3.5 pl-3 pr-4 sm:pl-3"><span className="sr-only">Edit</span></th>
                </tr>
              </thead>
              <tbody className="text-center divide-y-reverse rounded-full divide-neutral-300">
                {currentItems.map((item, index) => {
                  const metadata = item.metadata || {};
                  const isEditing = editingIndex === indexOfFirstItem + index;

                  return (
                    <tr key={index}>
                      <td className="border-b border-r border-neutral-300 whitespace-nowrap px-3 py-4 text-sm text-neutral-800 sm:pl-1 overflow-hidden text-ellipsis">
                        {isEditing ? (
                          <div ref={inputRef} className="flex items-center">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="text-sm text-neutral-800 text-opacity-80 mt-1 block w-full rounded-full p-2 border-2 border-stone-300 max-md:ml-4"
                            />
                            <button
                              onClick={() => saveEditing(indexOfFirstItem + index)}
                              className="ml-2 text-sm text-blue-500"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div
                            className="text-sm mt-1 block w-full rounded-md p-2 border-2 border-transparent text-neutral-800 text-opacity-80"
                            onDoubleClick={() => startEditing(indexOfFirstItem + index, metadata.original_name)}
                          >
                            {metadata.original_name || 'Unknown'}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-4 overflow-hidden text-sm border-b border-r border-neutral-300 whitespace-nowrap text-neutral-800 text-ellipsis">
                        {item.uploader || 'Unknown'}
                      </td>
                      <td className="px-3 py-4 overflow-hidden text-sm border-b border-r border-neutral-300 whitespace-nowrap text-neutral-800 text-ellipsis">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="relative mt-3.5 flex">
                        <PopupContent
                          file={item}
                          onRename={() => startEditing(indexOfFirstItem + index, metadata.original_name)}
                          onDelete={handleDelete}
                          onFileSelect={setSelectedFile}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredFiles.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default FileTable;
