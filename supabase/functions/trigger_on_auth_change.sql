-- First drop the trigger
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists on_auth_user_created();

drop trigger if exists on_auth_user_updated on auth.users;
drop function if exists on_auth_user_updated();

CREATE OR REPLACE FUNCTION on_auth_user_created()
RETURNS TRIGGER AS $$
DECLARE
    var_role TEXT := NEW.raw_user_meta_data ->> 'role';
    var_meta_data JSONB := NEW.raw_user_meta_data;
BEGIN

  INSERT INTO public.users_tb (user_id, user_meta_data) VALUES(NEW.id, var_meta_data);
  INSERT INTO public.roles_tb (user_id, name) VALUES(NEW.id, var_role);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE on_auth_user_created();

CREATE OR REPLACE FUNCTION on_auth_user_updated()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users_tb
  SET
    user_meta_data = NEW.raw_user_meta_data
  WHERE user_id = NEW.id;

  UPDATE public.roles_tb
  SET
    name = NEW.raw_user_meta_data ->> 'role'
  WHERE user_id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- trigger the function every time a user is updated
CREATE TRIGGER on_auth_user_updated
AFTER UPDATE ON auth.users
FOR EACH ROW EXECUTE PROCEDURE on_auth_user_updated();