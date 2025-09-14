
require "json"

# ==========================
# 🧱 PARSEADORES
# ==========================

def parse_fakemons(lines, suffix)
  fakemons = []
  current = nil

  lines.each do |line|
    line.strip!
    next if line.empty? || line.start_with?("#")

    if line.match(/^\[(.+)\]$/)
      fakemons << current if current
      current = {
        id: $1,
        name: "",
        types: [],
        sprite: "/Front/#{$1.upcase}.png",
        backSprite: "/spritesBack/#{$1.upcase}.png",
        description: "",
        stats: {
          hp: 0,
          attack: 0,
          defense: 0,
          spAttack: 0,
          spDefense: 0,
          speed: 0
        },
        height: "",
        weight: "",
        abilities: [],
        hiddenAbilities: [],
        category: "",
        moves: [],
        tutorMoves: [],
        eggMoves: [],
        suffix: suffix
      }
    elsif current
      key, value = line.split("=", 2).map(&:strip)

      case key
      when "Name"
        current[:name] = value
      when "Types"
        current[:types] = value.split(",")
      when "BaseStats"
        stats = value.split(",").map(&:to_i)
        current[:stats] = {
          hp: stats[0],
          attack: stats[1],
          defense: stats[2],
          spAttack: stats[4],
          spDefense: stats[5],
          speed: stats[3]
        }
      when "Height"
        current[:height] = value
      when "Weight"
        current[:weight] = value
      when "Abilities"
        current[:abilities] = value.split(",")
      when "HiddenAbilities"
        current[:hiddenAbilities] = value.split(",")
      when "Moves"
        # Remove level numbers (odd indices) and keep only move names
        current[:moves] = value
          .split(",")
          .map(&:strip)
          .reject { |v| v.match(/^\d+$/) }
      when "TutorMoves"
        current[:tutorMoves] = value.split(",")
      when "EggMoves"
        current[:eggMoves] = value.split(",")
      when "Category"
        current[:category] = value
      when "Pokedex"
        current[:description] = value
      end
    end
  end

  fakemons << current if current
  fakemons
end

def parse_moves(lines, suffix)
  moves = []
  current = nil

  lines.each do |line|
    line.strip!
    next if line.empty? || line.start_with?("#")

    if line.match(/^\[(.+)\]$/)
      moves << current if current
      current = {
        id: $1,
        name: "",
        type: "",
        category: "",
        power: nil,
        accuracy: nil,
        totalPP: 0,
        target: "",
        description: "",
        suffix: suffix,
        # passiveEffect: nil
      }
    elsif current
      key, value = line.split("=", 2).map(&:strip)

      case key
      when "Name"
        current[:name] = value
      when "Type"
        current[:type] = value
      when "Category"
        current[:category] = value
      when "Power"
        current[:power] = value == "0" ? nil : value.to_i
      when "Accuracy"
        current[:accuracy] = value == "0" ? nil : value.to_i
      when "TotalPP"
        current[:totalPP] = value.to_i
      when "Target"
        current[:target] = value
      when "Description"
        current[:description] = value
      when "PasiveDescription"
        current[:passiveEffect] = value
      end
    end
  end

  moves << current if current
  moves
end

def parse_abilities(lines, suffix)
  abilities = []
  current = nil

  lines.each do |line|
    line.strip!
    next if line.empty? || line.start_with?("#")

    if line.match(/^\[(.+)\]$/)
      abilities << current if current
      current = { id: $1, name: "", description: "", suffix: suffix }
    elsif current
      key, value = line.split("=", 2).map(&:strip)

      case key
      when "Name"
        current[:name] = value
      when "Description"
        current[:description] = value
      end
    end
  end

  abilities << current if current
  abilities
end

def parse_items(lines, suffix)
  items = []
  current = nil

  lines.each do |line|
    line.strip!
    next if line.empty? || line.start_with?("#")

    if line.match(/^\[(.+)\]$/)
      items << current if current
      current = {
        id: $1,
        name: "",
        namePlural: "",
        pocket: 0,
        price: 0,
        flags: "",
        description: "",
        sprite: "/Items/#{$1.upcase}.png",
        suffix: suffix
      }
    elsif current
      key, value = line.split("=", 2).map(&:strip)

      case key
      when "Name"
        current[:name] = value
      when "NamePlural"
        current[:namePlural] = value
      when "Pocket"
        current[:pocket] = value.to_i
      when "Price"
        current[:price] = value.to_i
      when "Flags"
        current[:flags] = value
      when "Description"
        current[:description] = value
      end
    end
  end

  items << current if current
  items
end

def parse_trainer_types(lines, suffix)
  trainer_types = []
  current = nil

  lines.each do |line|
    line.strip!
    next if line.empty? || line.start_with?("#")

    if line.match(/^\[(.+)\]$/)
      trainer_types << current if current
      current = {
        id: $1,
        name: "",
        gender: "",
        baseMoney: 0,
        suffix: suffix,
        sprite: "/Trainers/#{$1.upcase}.png",
        description: ""
      }
    elsif current
      key, value = line.split("=", 2).map(&:strip)

      case key
      when "Name"
        current[:name] = value
      when "Gender"
        current[:gender] = value
      when "BaseMoney"
        current[:baseMoney] = value.to_i
      end
    end
  end

  trainer_types << current if current
  trainer_types
end

# ==========================
# 📝 GENERADOR DE TS
# ==========================
def write_ts(output_path, type_name, export_name, data)
  File.write(
    output_path,
    "import type { #{type_name} } from \"@/types/#{type_name.downcase}\";\n\n"
  )
  File.open(output_path, "a") do |file|
    file.puts "export const #{export_name}: #{type_name}[] = "
    file.puts JSON.pretty_generate(data).gsub(/"(\w+)":/, '\1:')
  end
end

# ==========================
# 🚀 EJECUCIÓN
# ==========================

# Archivos de entrada/salida
# Archivos de entrada

# Archivos de salida

# Leer y combinar líneas de múltiples archivos
def read_combined_lines(paths)
  paths.flat_map { |path| File.readlines(path) }
end

# ========================================================== #
# Procesar Fakemons
# ========================================================== #
fakemon_configs = [
  {
    output: File.join(__dir__, "../src/data/pokemon_absolution.ts"),
    inputs: [File.join(__dir__, "./pokemon_absolution.txt")],
    suffix: "absolution"
  },
  {
    output: File.join(__dir__, "../src/data/pokemon.ts"),
    inputs: [File.join(__dir__, "./pokemon.txt")],
    suffix: "normal"
  }
]
fakemon_configs.each do |config|
  fakemons =
    parse_fakemons(read_combined_lines(config[:inputs]), config[:suffix])
  write_ts(config[:output], "Fakemon", "fakemons", fakemons)
  puts "✅ Fakemons generados en #{config[:output]}"
end

# ========================================================== #
# Procesar Movimientos
# ========================================================== #
moves_configs = [
  {
    output: File.join(__dir__, "../src/data/moves.ts"),
    inputs: [
      File.join(__dir__, "./moves.txt"),
      File.join(__dir__, "./moves_absolution.txt")
    ],
    suffix: "normal"
  }
]
moves_configs.each do |config|
  moves = parse_moves(read_combined_lines(config[:inputs]), config[:suffix])
  write_ts(config[:output], "Move", "moves", moves)
  puts "✅ Movimientos generados en #{config[:output]}"
end

# ========================================================== #
# Procesar Items
# ========================================================== #
items_configs = [
  {
    output: File.join(__dir__, "../src/data/items.ts"),
    inputs: [
      File.join(__dir__, "./items.txt"),
    ],
    suffix: "normal"
  },
  {
    output: File.join(__dir__, "../src/data/items_absolution.ts"),
    inputs: [
     File.join(__dir__, "./items_absolution.txt")
    ],
    suffix: "absolution"
  }
]
items_configs.each do |config|
  items = parse_items(read_combined_lines(config[:inputs]),config[:suffix])
  write_ts(config[:output], "Item", "items", items)
  puts "✅ Items generados en #{config[:output]}"
end

# ========================================================== #
# Procesar Habilidades
# ========================================================== #
abilities_configs = [
  {
    output: File.join(__dir__, "../src/data/abilities.ts"),
    inputs: [
      File.join(__dir__, "./abilities.txt"),
      File.join(__dir__, "./abilities_absolution.txt")
    ],
    suffix: "normal"
  }
]
abilities_configs.each do |config|
  abilities = parse_abilities(read_combined_lines(config[:inputs]),config[:suffix])
  write_ts(config[:output], "Ability", "abilities", abilities)
  puts "✅ Habilidades generadas en #{config[:output]}"
end
# ========================================================== #
# Procesar Trainer Types
# ========================================================== #
trainer_types_configs = [
  {
    output: File.join(__dir__, "../src/data/trainer_types.ts"),
    inputs: [
      File.join(__dir__, "./trainer_types.txt"),
      File.join(__dir__, "./trainer_types_absolution.txt")
    ],
    suffix: "normal"
  }
]
trainer_types_configs.each do |config|
  trainer_types = parse_trainer_types(read_combined_lines(config[:inputs]), config[:suffix])
  write_ts(config[:output], "TrainerType", "trainerTypes", trainer_types)
  puts "✅ Trainer Types generados en #{config[:output]}"
end
