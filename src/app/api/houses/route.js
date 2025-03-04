import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import House from "@/models/House";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// GET all houses remains unchanged
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

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "dealer") {
      return NextResponse.json(
        { success: false, error: "Permission denied" },
        { status: 403 }
      );
    }

    await dbConnect();
    const body = await request.json();

    body.createdBy = session.user.id;

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
