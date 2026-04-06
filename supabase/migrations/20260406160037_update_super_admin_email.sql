DO $$
DECLARE
  super_admin_id uuid;
  existing_user_id uuid;
BEGIN
  -- Check if sidneycamargo@gmail.com already exists
  SELECT id INTO existing_user_id FROM auth.users WHERE email = 'sidneycamargo@gmail.com';
  
  IF existing_user_id IS NOT NULL THEN
    -- Make this user super admin
    UPDATE public.profiles SET is_super_admin = true WHERE id = existing_user_id;
  ELSE
    -- Find existing super admin
    SELECT id INTO super_admin_id FROM public.profiles WHERE is_super_admin = true LIMIT 1;
    
    IF super_admin_id IS NOT NULL THEN
      UPDATE auth.users SET email = 'sidneycamargo@gmail.com' WHERE id = super_admin_id;
      UPDATE public.profiles SET email = 'sidneycamargo@gmail.com' WHERE id = super_admin_id;
    ELSE
      -- Insert new super admin
      super_admin_id := gen_random_uuid();
      INSERT INTO auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
        is_super_admin, role, aud,
        confirmation_token, recovery_token, email_change_token_new,
        email_change, email_change_token_current,
        phone, phone_change, phone_change_token, reauthentication_token
      ) VALUES (
        super_admin_id,
        '00000000-0000-0000-0000-000000000000',
        'sidneycamargo@gmail.com',
        crypt('Skip@Pass', gen_salt('bf')),
        NOW(), NOW(), NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"name": "Admin Sidney"}',
        false, 'authenticated', 'authenticated',
        '', '', '', '', '',
        NULL, '', '', ''
      );

      INSERT INTO public.profiles (id, email, name, is_super_admin)
      VALUES (super_admin_id, 'sidneycamargo@gmail.com', 'Admin Sidney', true)
      ON CONFLICT (id) DO UPDATE SET is_super_admin = true, email = 'sidneycamargo@gmail.com';
    END IF;
  END IF;
END $$;
