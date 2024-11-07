'use client'
import { useParams } from "next/navigation"
import { useState, useCallback } from 'react'
// import redis from '../../../utils/redis';

interface Row {
    time1: string;
    time2: string;
}

interface Rows {
    [key: string]: Row[];
}

// interface OccupancyTimeSlot {
//     time1: string;
//     time2: string;
//   }
  
//   interface UserOccupancy {
//     Sunday: OccupancyTimeSlot[];
//     Monday: OccupancyTimeSlot[];
//     Tuesday: OccupancyTimeSlot[];
//     Wednesday: OccupancyTimeSlot[];
//     Thursday: OccupancyTimeSlot[];
//     Friday: OccupancyTimeSlot[];
//     Saturday: OccupancyTimeSlot[];
//   }
  
//   interface UserData {
//     id: number;
//     name: string;
//     occupancy: UserOccupancy;
//   }
const Page = () => {
    const { id } = useParams()
      
    //   async function fetchData(id: number): Promise<UserData | null> {
    //       try {
    //           const data = await redis.get(`user:${id}:occupancy`);
    //           if (data) {
    //               const parsedData: UserData = JSON.parse(data);
    //               // Access user and occupancy data
    //               console.log(parsedData.user); // { id: 1, name: "John" }
    //               console.log(parsedData.occupancy); // { Sunday: [...], Monday: [...], ... }
    //               return parsedData;
    //           }
    //       } catch (error) {
    //           console.error('Error fetching data:', error);
    //           return null;
    //       }
    //   }
      
      // Example usage for user with id 1
    //   fetchData(1);
    console.log(id)
    const daysOfWeek = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    const [rows, setRows] = useState<Rows>({});
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const addRow = useCallback((day: string) => {
        setRows((prev) => ({
            ...prev,
            [day]: prev[day] ? [...prev[day], { time1: '', time2: '' }] : [{ time1: '', time2: '' }]
        }));
    }, [setRows]);

    const removeRow = (day: string, index: number) => {
        setRows((prev) => ({
            ...prev,
            [day]: prev[day].filter((_, i) => i !== index)
        }));
    };

    const handleTimeChange = (day: string, index: number, timeType: 'time1' | 'time2', value: string) => {
        console.log(day, index)
        const newRows = [...(rows[day] || [])];
        newRows[index] = { ...newRows[index], [timeType]: value };
        setRows((prev) => ({ ...prev, [day]: newRows }));
    };

    const validateTime = (day: string) => {
        const dayRows = rows[day] || [];
        const newErrors: { [key: string]: string } = {};

        for (let i = 0; i < dayRows.length; i++) {
            const { time1, time2 } = dayRows[i];

            if (time1 >= time2) {
                newErrors[day] = 'Start time must be earlier than end time';
                return newErrors;
            }

            for (let j = 0; j < dayRows.length; j++) {
                if (i !== j) {
                    const otherRow = dayRows[j];
                    if (
                        (time1 >= otherRow.time1 && time1 < otherRow.time2) ||
                        (time2 > otherRow.time1 && time2 <= otherRow.time2)
                    ) {
                        newErrors[day] = 'Time slots should not overlap';
                        return newErrors;
                    }
                }
            }
        }

        return newErrors;
    };

    const disableTimes = (day: string, index: number, timeType: 'time1' | 'time2') => {
        const dayRows = rows[day] || [];
        const currentRow = dayRows[index];

        if (!currentRow) return [];

        let disabledTimes: string[] = [];

        if (timeType === 'time1') {
            disabledTimes = dayRows
                .filter((row, i) => i !== index && row.time2)
                .map((row) => row.time2);
        }

        if (timeType === 'time2') {
            if (currentRow.time1) {
                disabledTimes = dayRows
                    .filter((row, i) => i !== index)
                    .map((row) => row.time1);
            }
        }
        return disabledTimes;
    };

    const handleSave = () => {
        let validationErrors: { [key: string]: string } = {};
        daysOfWeek.forEach((day) => {
            const dayErrors = validateTime(day);
            if (Object.keys(dayErrors).length > 0) {
                validationErrors = { ...validationErrors, ...dayErrors };
            }
        });

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            alert('Form is valid and ready to submit!');
        } else {
            alert('Form has errors, please fix them');
        }

        console.log(JSON.stringify(rows));

    };

    return (
        <div className="min-h-screen flex justify-center items-start bg-gray-50 py-6">
            <div className='w-3/5 bg-white shadow-lg rounded-lg p-6'>
                <div className="flex justify-between text-lg font-semibold mb-4">
                    {daysOfWeek.map((day, index) => (
                        <div
                            key={index}
                            className={`w-12 h-12 flex justify-center items-center rounded-full
                            ${index === 0 || index === 6 ? 'bg-gray-300 text-black' : 'bg-blue-500 text-white'}`}
                        >
                            <span className="font-bold text-sm">{day[0]}</span>
                        </div>
                    ))}
                </div>

                {daysOfWeek.map((day) => (
                    <div key={day} className="mt-4">
                        <div className="flex items-center space-x-4 mb-2">
                            <span className="font-bold text-md w-20">{day}</span>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="time"
                                    className="border rounded px-2 py-1"
                                    value={rows[day]?.[0]?.time1 || ''}
                                    onChange={(e) => handleTimeChange(day, 0, 'time1', e.target.value)}
                                    disabled={disableTimes(day, 0, 'time1').includes(rows[day]?.[0]?.time1)}
                                />
                                <span>to</span>
                                <input
                                    type="time"
                                    className="border rounded px-2 py-1"
                                    value={rows[day]?.[0]?.time2 || ''}
                                    onChange={(e) => handleTimeChange(day, 0, 'time2', e.target.value)}
                                    disabled={disableTimes(day, 0, 'time2').includes(rows[day]?.[0]?.time2)}
                                />
                                <button
                                    className="text-blue-500 text-xl"
                                    onClick={() => addRow(day)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {errors[day] && <div className="text-red-500 mt-2">{errors[day]}</div>}

                        {rows[day]?.slice(1).map((row, index) => (
                            <div key={index} className="flex items-center space-x-4 mb-2">
                                <input
                                    type="time"
                                    value={row.time1}
                                    onChange={(e) => handleTimeChange(day, index + 1, 'time1', e.target.value)}
                                    className="border rounded px-2 py-1"
                                    disabled={disableTimes(day, index + 1, 'time1').includes(row.time1)}
                                />
                                <span>to</span>
                                <input
                                    type="time"
                                    value={row.time2}
                                    onChange={(e) => handleTimeChange(day, index + 1, 'time2', e.target.value)}
                                    className="border rounded px-2 py-1"
                                    disabled={disableTimes(day, index + 1, 'time2').includes(row.time2)}
                                />
                                <button
                                    className="text-red-500 text-xl"
                                    onClick={() => removeRow(day, index + 1)}
                                >
                                    -
                                </button>
                            </div>
                        ))}
                    </div>
                ))}

                <button
                    onClick={handleSave}
                    className="mt-4 w-full bg-blue-500 text-white py-2 rounded"
                >
                    Save
                </button>
            </div>
        </div>
    )
}

export default Page;
