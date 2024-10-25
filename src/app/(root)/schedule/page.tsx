"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoDesktop } from "react-icons/io5";
import { DateTimePickerV2 } from "@/components/date-time";
import { useRouter } from "next/navigation";
import { useSession, useUser } from "@clerk/nextjs";
import { format, toZonedTime } from "date-fns-tz";
import CardSkeleton from "@/components/ui/card-skeleton";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiFileCopyLine } from "react-icons/ri";

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
  const { user } = useUser();
  const [userType, setUserType] = useState<"doctor" | "patient" | null>(null);
  const userId = user?.id;
  const [doctorEmail, setDoctorEmail] = useState<string | null>(null);
  const [doctorProfilePicture, setDoctorProfilePicture] = useState<
    string | null
  >(null);

  const userEmail =
    user?.emailAddresses?.[0]?.emailAddress || "No email available";

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

  const handleDoctorChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedName = event.target.value;
    const doctor = doctors.find((doc) => doc.name === selectedName);
    setSelectedDoctor(doctor || null);

    if (doctor) {
      try {
        const response = await fetch(
          `/api/getDoctorInfo?clerkId=${doctor.clerk_id}`
        );
        const data = await response.json();
        setDoctorEmail(data.email);
        setDoctorProfilePicture(data.profilePicture);
      } catch (error) {
        console.error("Error fetching doctor's email:", error);
      }
    }
  };

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

  const handleScheduleMeeting = () => {
    setShowDateTimePicker(!showDateTimePicker);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center py-[104px]">
      {upcomingMeeting && (
        <>
          <CardSkeleton className="w-full max-w-md p-6">
            <div className="text-center">
              <h1 className="mb-2 text-2xl font-bold text-center text-text-light">
                Upcoming Appointment
              </h1>

              <div className="flex flex-col items-center w-full">
                <div className="flex items-center justify-center px-3 py-1 border rounded-full w-fit border-bg-extralight bg-bg-light">
                  {roomID}{" "}
                  <button
                    onClick={() => navigator.clipboard.writeText(roomID)}
                    className="pl-1"
                  >
                    <RiFileCopyLine className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm">
                You have an appointment scheduled with{" "}
                {clerkId === upcomingMeeting.patientClerkId ? (
                  <>Dr. {upcomingMeeting.doctorName}</>
                ) : (
                  <>{upcomingMeeting.patientName}</>
                )}{" "}
                at {new Date(upcomingMeeting.meetingDateTime).toLocaleString()}.
                Please copy the above room code and proceed to the join meeting
                page.
              </p>

              {/* Join Meeting button */}
              <button
                onClick={handleJoinMeeting}
                className="mt-4 rounded-lg border border-primary/80 bg-primary/10 px-6 py-1.5 font-bold text-primary"
              >
                Join Meeting
              </button>
            </div>
          </CardSkeleton>
          <div className="w-full h-px max-w-lg my-8 bg-bg-extralight"></div>
        </>
      )}

      <CardSkeleton className="w-full max-w-md p-6">
        <h1 className="mb-4 text-2xl font-bold text-center text-text-light">
          Schedule Virtual Appointment
        </h1>

        <label>Select a doctor</label>
        <select id="doctor-select" onChange={handleDoctorChange} className="">
          <option value="">-- Choose a Doctor --</option>
          {doctors.map((doctor, index) => (
            <option key={index} value={doctor.name}>
              Dr. {doctor.name}
            </option>
          ))}
        </select>
        {selectedDoctor && selectedDoctor.name && doctorEmail ? (
          <>
            {!showDateTimePicker ? (
              <button
                onClick={handleScheduleMeeting}
                className="w-full p-2 mt-4 font-bold border rounded-lg border-primary/80 bg-primary/10 text-primary"
              >
                Schedule with Dr. {selectedDoctor.name}
              </button>
            ) : (
              <div />
            )}
          </>
        ) : (
          <div></div>
        )}
      </CardSkeleton>

      {doctorProfilePicture && selectedDoctor && doctorEmail ? (
        <CardSkeleton className="flex items-center w-full max-w-md p-6 mt-4">
          <img
            src={doctorProfilePicture}
            alt={`${selectedDoctor.name}'s profile`}
            className="w-24 h-full rounded-2xl"
          />
          <div className="w-full pl-6">
            <h1 className="mb-1 text-xl font-bold text-text-light">
              Dr. {selectedDoctor.name}
            </h1>
            <p className="mb-2 text-sm">
              This doctor studied {selectedDoctor.degree} and currently works at{" "}
              {selectedDoctor.practiceLocation}.
            </p>
            <div className="flex items-center space-x-1">
              <MdOutlineMailOutline className="w-4 h-4 text-text " />
              <a
                target="_blank"
                href={`mailto:${doctorEmail}`}
                className="text-xs"
              >
                {doctorEmail}
              </a>
            </div>
          </div>
        </CardSkeleton>
      ) : (
        <div />
      )}

      {showDateTimePicker && (
        <CardSkeleton className="w-full max-w-md p-6 mt-4">
          {/* DateTimePicker */}
          {showDateTimePicker && (
            <div className="flex flex-col items-center mt-4 -translate-y-2">
              <DateTimePickerV2
                onDateChange={handleDateChange}
                selectedDate={selectedDate}
                selectedDoctor={selectedDoctor}
              />
            </div>
          )}
        </CardSkeleton>
      )}
    </div>
  );
}
