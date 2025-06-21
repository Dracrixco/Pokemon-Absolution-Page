require 'json'

# ==========================
# 🧱 PARSEADORES
# ==========================

def parse_fakemons(lines)
  fakemons = []
  current = nil

  lines.each do |line|
    line.strip!
    next if line.empty? || line.start_with?('#')

    if line.match(/^\[(.+)\]$/)
      fakemons << current if current
      current = {
        id: $1,
        name: '',
        types: [],
        sprite: "/sprites/#{$1.upcase}.png",
        artwork: "/artwork/#{$1.downcase}.png",
        description: '',
        stats: {
          hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0
        },
        height: '',
        weight: '',
        abilities: [],
        hiddenAbilities: [],
        category: '',
        moves: [],
        tutorMoves: [],
        eggMoves: []
      }
    elsif current
      key, value = line.split('=', 2).map(&:strip)

      case key
      when 'Name' then current[:name] = value
      when 'Types' then current[:types] = value.split(',')
      when 'BaseStats'
        stats = value.split(',').map(&:to_i)
        current[:stats] = {
          hp: stats[0], attack: stats[1], defense: stats[2],
          spAttack: stats[3], spDefense: stats[4], speed: stats[5]
        }
      when 'Height' then current[:height] = value
      when 'Weight' then current[:weight] = value
      when 'Abilities' then current[:abilities] = value.split(',')
      when 'HiddenAbilities' then current[:hiddenAbilities] = value.split(',')
      when 'Moves' then current[:moves] = value.split(',')
      when 'TutorMoves' then current[:tutorMoves] = value.split(',')
      when 'EggMoves' then current[:eggMoves] = value.split(',')
      when 'Category' then current[:category] = value
      when 'Pokedex' then current[:description] = value
      end
    end
  end

  fakemons << current if current
  fakemons
end

def parse_moves(lines)
  moves = []
  current = nil

  lines.each do |line|
    line.strip!
    next if line.empty? || line.start_with?('#')

    if line.match(/^\[(.+)\]$/)
      moves << current if current
      current = {
        id: $1,
        name: '',
        type: '',
        category: '',
        power: nil,
        accuracy: nil,
        totalPP: 0,
        target: '',
        description: ''
      }
    elsif current
      key, value = line.split('=', 2).map(&:strip)

      case key
      when 'Name' then current[:name] = value
      when 'Type' then current[:type] = value
      when 'Category' then current[:category] = value
      when 'Power' then current[:power] = value == '0' ? nil : value.to_i
      when 'Accuracy' then current[:accuracy] = value == '0' ? nil : value.to_i
      when 'TotalPP' then current[:totalPP] = value.to_i
      when 'Target' then current[:target] = value
      when 'Description' then current[:description] = value
      end
    end
  end

  moves << current if current
  moves
end

# ==========================
# 📝 GENERADOR DE TS
# ==========================

def write_ts(output_path, type_name, export_name, data)
  File.write(output_path, "import type { #{type_name} } from \"@/types/#{type_name.downcase}\";\n\n")
  File.open(output_path, 'a') do |file|
    file.puts "export const #{export_name}: #{type_name}[] = "
    file.puts JSON.pretty_generate(data).gsub(/"(\w+)":/, '\1:')
  end
end

# ==========================
# 🚀 EJECUCIÓN
# ==========================

# Archivos de entrada/salida
fakemon_input = File.join(__dir__, './pokemon_absolution.txt')
fakemon_output = File.join(__dir__, '../src/data/pokemon.ts')

moves_input = File.join(__dir__, './moves.txt')
moves_output = File.join(__dir__, '../src/data/moves.ts')

# Procesar Fakemons
fakemons = parse_fakemons(File.readlines(fakemon_input))
write_ts(fakemon_output, 'Fakemon', 'fakemons', fakemons)
puts "✅ Fakemons generados en #{fakemon_output}"

# Procesar Movimientos
moves = parse_moves(File.readlines(moves_input))
write_ts(moves_output, 'Move', 'moves', moves)
puts "✅ Movimientos generados en #{moves_output}"
