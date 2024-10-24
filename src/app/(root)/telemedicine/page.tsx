"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoDesktop } from "react-icons/io5";
import { DateTimePickerV2 } from "@/components/date-time";
import { useRouter } from "next/navigation";
import { useSession } from "@clerk/nextjs";
import { format, toZonedTime } from "date-fns-tz";
import CardSkeleton from "@/components/ui/card-skeleton";

interface Doctor {
  clerk_id: string;
  name: string;
  phoneNumber: string;
  degree: string;
  practiceLocation: string;
}

// Utility function to format phone numbers
const formatPhoneNumber = (phoneNumber: string) => {
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]})-${match[2]}-${match[3]}`;
  }
  return phoneNumber;
};

export default function TelemedicinePage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [schedules, setSchedules] = useState([]);
  const [roomID, setRoomID] = useState<string | null>(null);
  const router = useRouter();
  const { session } = useSession();
  const clerkId = session?.user?.id;
  const patientName = session?.user?.fullName || "Patient";
  const [upcomingMeeting, setUpcomingMeeting] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/telemedicineQuery");
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchSchedulesAndCheckMeetings = async () => {
      try {
        const response = await fetch("/api/schedules");
        const data = await response.json();
        setSchedules(data);

        const currentTime = new Date();

        // Check for upcoming meetings
        const upcomingMeeting = data.find((schedule) => {
          const meetingTimeUTC = new Date(schedule.meetingDateTime);
          const localMeetingTime = toZonedTime(
            meetingTimeUTC,
            schedule.timeZone
          ); // Convert to user's timezone
          const timeDiff = localMeetingTime.getTime() - currentTime.getTime();
          return (
            (schedule.patientClerkId === clerkId ||
              schedule.doctorClerkId === clerkId) &&
            timeDiff >= -30 * 60 * 1000 && // Show for 30 minutes after the start time
            timeDiff <= 5 * 60 * 1000 // Start showing 5 minutes before the meeting
          );
        });

        if (upcomingMeeting) {
          setRoomID(upcomingMeeting.roomID || null);
        }

        setUpcomingMeeting(upcomingMeeting || null);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchSchedulesAndCheckMeetings();
    const intervalId = setInterval(fetchSchedulesAndCheckMeetings, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId);
  }, [clerkId]);

  const handleJoinMeeting = () => {
    router.push("/room");
  };

  const handleDoctorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = event.target.value;
    const doctor = doctors.find((doc) => doc.name === selectedName);
    setSelectedDoctor(doctor || null);
  };

  const handleScheduleMeeting = () => {
    setShowDateTimePicker(!showDateTimePicker);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      <CardSkeleton className="w-full max-w-md  p-6">
        <h1 className="text-center text-2xl font-bold text-text-light mb-6">
          Schedule Virtual Appointment
        </h1>
        <label>Select a doctor</label>

        <select
          id="doctor-select"
          onChange={handleDoctorChange}
          className=""
        >
          <option value="">-- Choose a Doctor --</option>
          {doctors.map((doctor, index) => (
            <option key={index} value={doctor.name}>
              {doctor.name}
            </option>
          ))}
        </select>

        {/* Doctor Details */}
        {selectedDoctor && (
          <div
            className="mt-8 text-center"
          >
            <h2 className="text-2xl font-semibold">{selectedDoctor.name}</h2>
            <p className="mt-2 text-lg">
              <strong>Degree:</strong> {selectedDoctor.degree}
            </p>
            <p className="mt-2 text-lg">
              <strong>Phone:</strong>{" "}
              {formatPhoneNumber(selectedDoctor.phoneNumber)}
            </p>
            <p className="mt-2 text-lg">
              <strong>Practice Location:</strong>{" "}
              {selectedDoctor.practiceLocation}
            </p>

            {/* Schedule a Virtual Meeting button */}
            <button
              onClick={handleScheduleMeeting}
              className="mt-4 rounded-md bg-green-500 p-2 text-white"
            >
              Schedule a Virtual Meeting with {selectedDoctor.name}
            </button>

            {/* DateTimePicker */}
            {showDateTimePicker && (
              <div className="mt-4 flex flex-col items-center">
                <DateTimePickerV2
                  onDateChange={handleDateChange}
                  selectedDate={selectedDate}
                  selectedDoctor={selectedDoctor}
                />
                {selectedDate && (
                  <p className="mt-2 text-lg">
                    Selected Date: {selectedDate.toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        {upcomingMeeting && (
          <div
            className="mt-8 text-center"
          >
            <h2 className="text-2xl font-semibold">Upcoming Meeting</h2>

            {/* Conditionally display doctor's or patient's name */}
            <p className="mt-2 text-lg">
              {clerkId === upcomingMeeting.patientClerkId ? (
                <>Upcoming Meeting with Dr. {upcomingMeeting.doctorName}</>
              ) : (
                <>Upcoming Meeting with {upcomingMeeting.patientName}</>
              )}
            </p>

            <p className="mt-2 text-lg">
              Meeting Time:{" "}
              {format(
                new Date(upcomingMeeting.meetingDateTime),
                "yyyy-MM-dd HH:mm:ss",
                { timeZone: upcomingMeeting.timeZone }
              )}
            </p>

            {/* Display Meeting ID */}
            {roomID && (
              <div className="mt-2">
                <p className="text-lg">
                  <strong>Room ID: </strong>
                  {roomID}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Please copy this Room ID and paste it in the Room ID field
                  after clicking Join Meeting.
                </p>
              </div>
            )}

            {/* Join Meeting button */}
            <button
              onClick={handleJoinMeeting}
              className="mt-4 rounded-md bg-blue-500 p-2 text-white"
            >
              Join Meeting
            </button>
          </div>
        )}
      </CardSkeleton>
    </div>
  );
}
