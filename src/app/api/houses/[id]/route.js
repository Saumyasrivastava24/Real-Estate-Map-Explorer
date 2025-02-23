import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import House from "@/models/House";


// GET a single house
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const house = await House.findById(params.id);
    if (!house) {
      return NextResponse.json(
        { success: false, error: "House not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: house }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// UPDATE a house
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();
    const updatedHouse = await House.findByIdAndUpdate(params.id, body, {
      new: true, // return the updated document
    });
    if (!updatedHouse) {
      return NextResponse.json(
        { success: false, error: "House not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, data: updatedHouse },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE a house
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const deletedHouse = await House.findByIdAndDelete(params.id);
    if (!deletedHouse) {
      return NextResponse.json(
        { success: false, error: "House not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, data: deletedHouse },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
