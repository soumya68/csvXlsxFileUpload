API 1 - Endpoint - localhost:8000/api/upload/file Param - file (in form data) Method - POST Details - To upload provided csv/xlsx file

API 2 - Endpoint - localhost:8000/api/search Param - username (in body) Method - GET Details - To get policy details by username

API3 - Endpoint - localhost:8000/api/userspolicy Param - limit,order (limit is a number & order is 1 for asending & -1 for desending order in body) Method - GET Details - To get all users policy details

API4 - Endpoint - localhost:8000/api/message Param - message,date,time (date example - 03/21/2024 & time will be in milliseconnd from front end like - 1711035900000 in body) Method - POST Details - Message will be inserted to message collection on provided date & time only
