@ECHO OFF
title Folder Locker
if EXIST "LockedFolder_Secured" goto UNLOCK
if NOT EXIST LockedFolder goto MDLOCKER

:CONFIRM
echo Are you sure you want to lock the folder? (Y/N)
set/p "cho=>"
if %cho%==Y goto LOCK
if %cho%==y goto LOCK
if %cho%==n goto END
if %cho%==N goto END
echo Invalid choice.
goto CONFIRM

:LOCK
ren LockedFolder "LockedFolder_Secured"
attrib +h +s "LockedFolder_Secured"
echo Folder locked
goto End

:UNLOCK
echo Enter password to unlock folder:
set/p "pass=>"
if NOT "%pass%"=="1128" goto FAIL
attrib -h -s "LockedFolder_Secured"
ren "LockedFolder_Secured" LockedFolder
echo Folder Unlocked successfully
goto End

:FAIL
echo Invalid password
goto end

:MDLOCKER
md LockedFolder
echo LockedFolder created successfully
goto End

:End
