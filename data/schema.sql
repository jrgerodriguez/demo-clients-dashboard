-- =====================
-- SCHEMA COMPLETO - ClientesPro
-- Correr en el SQL Editor de un nuevo proyecto de Supabase
-- =====================

-- =====================
-- TABLAS
-- =====================

CREATE TABLE clientes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre_completo text NOT NULL,
  telefono text,
  email text,
  direccion text,
  notas text,
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE perros (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id uuid NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  raza text,
  fecha_nacimiento date,
  foto_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE citas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id uuid REFERENCES clientes(id) ON DELETE CASCADE,
  perro_id uuid REFERENCES perros(id) ON DELETE SET NULL,
  fecha date NOT NULL,
  hora_inicio time NOT NULL,
  duracion int NOT NULL,
  costo numeric(10,2),
  notas text,
  metodo_pago text CHECK (metodo_pago IN ('efectivo', 'tarjeta', 'transferencia')),
  estado text NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completado')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE usuarios_autorizados (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  nombre text,
  rol text NOT NULL DEFAULT 'user' CHECK (rol IN ('admin', 'user')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_email text,
  usuario_nombre text,
  accion text NOT NULL,
  detalles text,
  created_at timestamptz DEFAULT now()
);

-- =====================
-- ROW LEVEL SECURITY
-- =====================

ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE perros ENABLE ROW LEVEL SECURITY;
ALTER TABLE citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios_autorizados ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON clientes FOR ALL USING (true);
CREATE POLICY "Allow all" ON perros FOR ALL USING (true);
CREATE POLICY "Allow all" ON citas FOR ALL USING (true);
CREATE POLICY "Allow all" ON usuarios_autorizados FOR ALL USING (true);
CREATE POLICY "Allow all" ON logs FOR ALL USING (true);

-- =====================
-- STORAGE: FOTOS DE PERROS
-- Crea el bucket "perros" (público) para las fotos
-- =====================

INSERT INTO storage.buckets (id, name, public)
VALUES ('perros', 'perros', true)
ON CONFLICT (id) DO NOTHING;

-- SELECT solo para usuarios autenticados (necesario para el upsert al subir fotos).
-- Las fotos se ven publicamente igual via getPublicUrl, sin pasar por esta policy.
CREATE POLICY "Lectura autenticada fotos perros"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'perros');

CREATE POLICY "Subir fotos perros"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'perros');

CREATE POLICY "Actualizar fotos perros"
ON storage.objects FOR UPDATE
USING (bucket_id = 'perros');

CREATE POLICY "Eliminar fotos perros"
ON storage.objects FOR DELETE
USING (bucket_id = 'perros');

-- =====================
-- USUARIO ADMIN INICIAL
-- Reemplaza el email antes de correr esta línea
-- =====================

-- INSERT INTO usuarios_autorizados (email, nombre, rol)
-- VALUES ('tu@email.com', 'Tu Nombre', 'admin');
