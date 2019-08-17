@echo off

cd\Program Files\MongoDB\Server\4.0\bin

title bucle for


for /l %%i in (1, 1, 70) do (start mongoimport.exe --db Cartilla --collection doctors "C:\Users\pintu\OneDrive\Escritorio\CartillaV.0.2\src\Datos BD\Usuarios_doctores\dataAug-6-2019 (%%i).json"  --jsonArray)

pause>nul

cd\Users\pintu\OneDrive\Escritorio\CartillaV.0.2