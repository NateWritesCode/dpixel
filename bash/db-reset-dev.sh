initial_path=$(pwd);

echo "Your initial path is: $initial_path";

rm -rf ./.wrangler/state/v3/d1/miniflare-D1DatabaseObject/*;

for sql_file in ${initial_path}/sql/*.sql; do
    echo "Executing file: $sql_file";
    bunx wrangler d1 execute dpixel --local --file=${sql_file};
done
