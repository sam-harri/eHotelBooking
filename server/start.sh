git clone https://github.com/sam-harri/eHotelBooking.git
cd ehotelclient
npm install
npm run dev
cd ../server
echo "POSTGRES_PASSWORD='YourPassword'" > .env
echo "POSTGRES_USER='YourUser'" >> .env
echo "POSTGRES_PORT='YourPort'" >> .env
echo "POSTGRES_HOST='YourHost'" >> .env
echo "POSTGRES_DATABASE='YourDatabase'" >> .env
# fill in the blanks of .env

pip install virtualenv
python -m virtualenv venv
source venv/bin/activate (if on linux)
# venv\Scripts\activate.bat (if on windows)
pip install -r requirements.txt
python main.py
