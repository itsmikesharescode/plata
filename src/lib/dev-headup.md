# Stop all running containers

docker stop $(docker ps -q)

# Remove all containers (including stopped ones)

docker rm $(docker ps -a -q)

# Remove all unused containers, networks, images (both dangling and unreferenced), and optionally, volumes

docker system prune -a

# Include volumes in the cleanup

docker system prune -a --volumes

#get types locally

supabase gen types --local > src/lib/database.types.ts

#get db copy locally

supabase db dump --local -f supabase/schema.sql

#user_meta_data -> UserMeta from ./types
#assigned_subjects -> AssignedSubject from ./types
