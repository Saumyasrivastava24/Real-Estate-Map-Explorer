import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import House from "@/models/House";

// GET all houses
export async function GET() {
  try {
    await dbConnect();
    const houses = await House.find({});
    return NextResponse.json({ success: true, data: houses }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// CREATE a new house
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newHouse = await House.create(body);
    return NextResponse.json(
      { success: true, data: newHouse },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
