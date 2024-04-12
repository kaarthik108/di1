import csv
from io import StringIO
from js import Response

MAX_RECORDS = 2000  # Constant to control the number of records to process

async def on_fetch(request, env):
    if request.method == "POST":
        csv_data = await request.text()
        if csv_data:
            reader = csv.DictReader(StringIO(csv_data))
            
            # Prepare the INSERT statement
            insert_stmt = env.DB.prepare("""
                INSERT INTO companies (
                    company_id, company_name, short_description, long_description,
                    batch, status, tags, location, country, year_founded,
                    num_founders, founders_names, team_size, website, cb_url, linkedin_url
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """)
            
            # Process the CSV data row by row
            count = 0
            for row in reader:
                if count >= MAX_RECORDS:
                    break
                
                await insert_stmt.bind(
                    row["company_id"], row["company_name"], row["short_description"], row["long_description"],
                    row["batch"], row["status"], row["tags"], row["location"], row["country"], row["year_founded"],
                    row["num_founders"], row["founders_names"], row["team_size"], row["website"], row["cb_url"], row["linkedin_url"]
                ).run()
                
                count += 1
            
            return Response.new(f"CSV data imported successfully. Processed {count} records.")
        else:
            return Response.new("No CSV data found", status=400)
    else:
        return Response.new("Invalid request method", status=405)