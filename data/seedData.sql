-- Tabla clientes
create table clientes (
  id uuid default gen_random_uuid() primary key,
  nombre_completo text not null,
  telefono text,
  email text,
  direccion text,
  notas text,
  created_at timestamptz default now()
);

-- Tabla citas
create table citas (
  id uuid default gen_random_uuid() primary key,
  cliente_id uuid references clientes(id) on delete cascade,
  fecha date not null,
  hora_inicio time not null,
  duracion int not null,
  notas text,
  metodo_pago text check (metodo_pago in ('efectivo', 'tarjeta', 'transferencia')),
  estado text not null default 'pendiente' check (estado in ('pendiente', 'completado')),
  created_at timestamptz default now()
);

-- Seed clientes
insert into clientes (id, nombre_completo, telefono, email, direccion, notas) values
  ('a1b2c3d4-0000-0000-0000-000000000001', 'Juan Pérez', '78901234', 'juan@email.com', 'San Salvador', 'Cliente frecuente'),
  ('a1b2c3d4-0000-0000-0000-000000000002', 'María López', '72345678', 'maria@email.com', 'Santa Ana', null),
  ('a1b2c3d4-0000-0000-0000-000000000003', 'Carlos Martínez', '76543210', null, 'San Miguel', 'Prefiere llamadas por la tarde');

-- Seed citas
insert into citas (cliente_id, fecha, hora_inicio, duracion, notas, metodo_pago, estado) values
  ('a1b2c3d4-0000-0000-0000-000000000001', '2026-03-20', '09:00', 60, 'Primera consulta', 'efectivo', 'pendiente'),
  ('a1b2c3d4-0000-0000-0000-000000000001', '2026-03-21', '10:00', 30, 'Seguimiento', 'tarjeta', 'completado'),
  ('a1b2c3d4-0000-0000-0000-000000000002', '2026-03-22', '11:00', 90, 'Revisión general', 'transferencia', 'pendiente'),
  ('a1b2c3d4-0000-0000-0000-000000000003', '2026-03-23', '14:00', 45, null, 'efectivo', 'completado');