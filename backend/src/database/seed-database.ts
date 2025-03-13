import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { client } from "../index";
console.log(process.env.GOOGLE_API_KEY);

const locations = [
  {
    name: "Main Entrance Gate",
    coordinates: [79.046936, 21.006091],
    description: "The main entrance of Pallotthi.",
    funFact:
      "Legend has it, if you step in with your right foot first, you might pass your exams without studying. No guarantees though!",
    briefDescription:
      "The iconic entry point of Pallotthi, where dreams begin (and sometimes crash). Coordinates: [79.046936, 21.006091].",
    location_id: "1",
  },
  {
    name: "Block A",
    coordinates: [79.04755853946051, 21.005727063090273],
    description: "Block A with various departments and labs.",
    funFact:
      "Rumor has it, the computer lab chairs automatically eject students who fall asleep during exams.",
    briefDescription:
      "Block A houses Electrical (1st floor), IoT and Mechanical (2nd floor), Civil and Principal’s office on the ground floor, along with labs for exams and practicals. Coordinates: [79.04755853946051, 21.005727063090273].",
  },
  {
    name: "Block B",
    coordinates: [79.04758213339973, 21.004859255833335],
    description: "Block B with tech departments, library, and admin offices.",
    funFact:
      "The library is said to have a secret portal to an alternate dimension where deadlines don’t exist (still undiscovered).",
    briefDescription:
      "Block B hosts CS, IT, DS, admin offices, library, auditorium, and more. 3rd floor: 1st year, 2nd floor: AI/DS & E-Yantra, 1st floor: CS & IT, ground floor: library. Coordinates: [79.04758213339973, 21.004859255833335].",
  },
  {
    name: "Zerox Center",
    coordinates: [79.04689631730784, 21.006255724622687],
    description: "The Xerox center of Pallotthi.",
    funFact:
      "The place where students realize they need 100 pages printed 5 minutes before submission!",
    briefDescription:
      "The lifesaving Xerox hub, always bustling with last-minute panic. Coordinates: [79.04689631730784, 21.006255724622687].",
    location_id: "2",
  },
  {
    name: "Student Parking",
    coordinates: [79.04739003543136, 21.006092658623324],
    description: "Parking area for students.",
    funFact:
      "A magical land where finding a spot feels like winning a treasure hunt.",
    briefDescription:
      "A chaotic jungle of bikes and cars, ruled by the luckiest of students. Coordinates: [79.04739003543136, 21.006092658623324].",
    location_id: "3",
  },
  {
    name: "Cafeteria",
    coordinates: [79.0481308240417, 21.005927929722862],
    description: "The cafeteria of Pallotthi.",
    funFact:
      "The birthplace of revolutionary ideas and last-minute project discussions over samosas and chai!",
    briefDescription:
      "The gastronomic paradise where hunger meets inspiration. Coordinates: [79.0481308240417, 21.005927929722862].",
    location_id: "4",
  },
  {
    name: "Fathers House",
    coordinates: [79.04867020351344, 21.00583645853737],
    description: "Residence of the college father.",
    funFact:
      "Rumor has it, this is the secret HQ where all the surprise tests are planned.",
    briefDescription:
      "A serene abode, shrouded in mystery and occasional academic doom. Coordinates: [79.04867020351344, 21.00583645853737].",
    location_id: "5",
  },
  {
    name: "College Ground",
    coordinates: [79.04903567303508, 21.00679393735107],
    description: "The ground of Pallotthi.",
    funFact:
      "The spot where every sports enthusiast turns into a champion, at least in their head.",
    briefDescription:
      "The sprawling battlefield of epic sports showdowns and overconfident players. Coordinates: [79.04903567303508, 21.00679393735107].",
    location_id: "6",
  },
  {
    name: "Womens Hostel",
    coordinates: [79.04847530939244, 21.007601376765397],
    description: "Hostel for women.",
    funFact:
      "Where movie marathons and midnight maggi sessions are a sacred tradition.",
    briefDescription:
      "A vibrant haven of sisterhood, study nights, and never-ending gossip. Coordinates: [79.04847530939244, 21.007601376765397].",
    location_id: "7",
  },
  {
    name: "Basketball Ground",
    coordinates: [79.04899177930864, 21.007543733398997],
    description: "The basketball ground of Pallotthi.",
    funFact:
      "Where people discover their hidden basketball skills... or lack thereof.",
    briefDescription:
      "The court where dreams of dunking collide with reality. Coordinates: [79.04899177930864, 21.007543733398997].",
    location_id: "8",
  },
  {
    name: "Boys Hostel",
    coordinates: [79.04927588967212, 21.007472145915727],
    description: "The SVPCET boys hostel.",
    funFact:
      "A mystical place where sleep schedules are optional, but gaming marathons are mandatory.",
    briefDescription:
      "The kingdom of endless games, ramen, and late-night philosophical debates. Coordinates: [79.04927588967212, 21.007472145915727].",
    location_id: "9",
  },
];

export const seedDatabase = async () => {
  try {
    const db = client.db("college_database");
    const collection = db.collection("locations");

    const location = await collection.insertMany(locations);

    console.log("Successfully Processed and saved all records", location);
  } catch (error) {
    console.log("Error processing and saving records: ", error);
  }
};
