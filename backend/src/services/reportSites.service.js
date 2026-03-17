import { supabase } from "../supabase.js";

export const insertSiteReports = async (reportData, file) => {
  let photoUrl = ""; //Storing the photourl

  //This is executed only if user uploaded an image
  if (file && file.buffer) {
    //Get the uploaded file type
    const fileExtension = file.mimetype.split("/")[1];

    //Creating a unique file name using the current date and using random numbers
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

    // Upload the image to Supabase Storage
    const uploadResponse = await supabase.storage
      .from("breedingsite-images") // select the bucket
      .upload(
        fileName, // name of the file inside the bucket
        file.buffer, // actual image data stored in memory
        {
          contentType: file.mimetype, // set correct image type (jpeg, png, etc.)
        },
      );

    //Check if there was an error during upload
    if (uploadResponse.error) {
      console.log(uploadResponse.error);
      throw new Error("Image upload failed");
    }

    // Generate public URL for the uploaded file
    const publicUrlResponse = supabase.storage
      .from("breedingsite-images")
      .getPublicUrl(fileName); // generate public link

    //Store the generated URL to access for the manage breeding sites for MOH
    photoUrl = publicUrlResponse.data.publicUrl;
  }

  // Insert report data into database table
  const data = await supabase
    .from("breeding_sites")
    .insert([
      {
        location: reportData.location,
        description: reportData.description,
        issue_type: reportData.issueType,
        urgency: reportData.urgency,
        moh_area: reportData.mohArea,
        photo_url: photoUrl,
        latitude: reportData.latitude,
        longitude: reportData.longtitude,
      },
    ])
    .select();

  if (data.error) {
    console.log(data.error);
    throw new Error("Report Upload Failed!");
  }

  return data;
};

export const fetchBreedingSitesLocations = async () => {
  const { data, error } = await supabase
    .from("breeding_sites")
    .select(" location, latitude, longtitude")
    .order("created_at", { ascending: false });
  if (error) throw error;

  return (data ?? []).map((row) => ({
    ...row,
    coordinates:
      row.latitude != null && row.longtitude != null
        ? { lat: row.latitude, lng: row.longtitude }
        : null,
  }));

};