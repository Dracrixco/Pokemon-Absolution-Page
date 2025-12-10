require "json"

# ==========================
# 🧱 PARSEADORES
# ==========================

NOT_ABLE_TO_SHOW_FAKEMONS = %w[
  BEHDAREX
  ZIZZENIT
  LEVIATITAN
  FATALTTY
  KINGDER
  TWIXIE
  TWINCESS
  BUSHIERA
  WEREWOODS
  DOLORN
  MALICEAR
  ABANDOLED
  FLOVERN
  WYWERDEN
  MABBIT
  BUNLUCK
  FORTUNELLE
  OTTRICK
  LUTRION
  MAJOTTER
  DOLOVE
  SERENOVE
  ANTICORE
  DRANTICORE
]
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
        backSprite: "/Back/#{$1.upcase}.png",
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
        suffix: suffix,
        evolution: [],
        color: ""
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
      when "Evolution"
        evo_parts = value.split(",").map(&:strip)
        if evo_parts.size == 3
          current[:evolution] = [
            { to: evo_parts[0], method: evo_parts[1], value: evo_parts[2] }
          ]
        end
      when "Color"
        current[:color] = value
      end
    end
  end

  # Validation to skip certain fakemons
  fakemons << current if current
  fakemons.reject! do |fakemon|
    NOT_ABLE_TO_SHOW_FAKEMONS.include?(fakemon[:id])
  end
  fakemons
end

def parse_forms(lines, suffix, base_pokemons)
  forms = []
  current = nil

  lines.each do |line|
    line.strip!
    next if line.empty? || line.start_with?("#")

    if line.match(/^\[(.+),(\d+)\]$/)
      forms << current if current

      base_id = $1
      form_number = $2.to_i

      # Find base pokemon
      base_pokemon = base_pokemons.find { |p| p[:id] == base_id }

      # Initialize with base pokemon data or defaults
      if base_pokemon
        current = base_pokemon.dup
        current[:stats] = base_pokemon[:stats].dup
        current[:types] = base_pokemon[:types].dup
        current[:abilities] = base_pokemon[:abilities].dup
        current[:hiddenAbilities] = base_pokemon[:hiddenAbilities].dup
        current[:moves] = base_pokemon[:moves].dup if base_pokemon[:moves]
        current[:tutorMoves] = base_pokemon[:tutorMoves].dup if base_pokemon[
          :tutorMoves
        ]
        current[:eggMoves] = base_pokemon[:eggMoves].dup if base_pokemon[
          :eggMoves
        ]
        current[:evolution] = base_pokemon[:evolution].dup if base_pokemon[
          :evolution
        ]
        current[:sprite] = "/Front/#{base_id.upcase}_#{form_number}.png"
        current[:backSprite] = "/Back/#{base_id.upcase}_#{form_number}.png"
      else
        current = {
          id: base_id,
          name: "",
          types: [],
          sprite: "/Front/#{base_id.upcase}_#{form_number}.png",
          backSprite: "/Back/#{base_id.upcase}_#{form_number}.png",
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
          evolution: [],
          color: ""
        }
      end

      # Set form-specific fields
      current[:formNumber] = form_number
      current[:formName] = ""
      current[:baseId] = base_id
      current[:suffix] = suffix
      current[:megaStone] = nil
    elsif current
      key, value = line.split("=", 2).map(&:strip)

      case key
      when "FormName"
        current[:formName] = value
      when "MegaStone"
        current[:megaStone] = value
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
      when "Color"
        current[:color] = value
      when "Evolution"
        evo_parts = value.split(",").map(&:strip)
        if evo_parts.size == 3
          current[:evolution] = [
            { to: evo_parts[0], method: evo_parts[1], value: evo_parts[2] }
          ]
        end
      end
    end
  end

  forms << current if current
  forms
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
        suffix: suffix
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
        # Evolution = BEHCEDRO,Level,16
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

def parse_map_metadata(lines)
  maps = {}
  current = nil
  current_id = nil
  
  lines.each do |line|
    line.strip!
    next if line.empty? || line.start_with?("#")
    
    # Match map ID like [001] (permite contenido después del ])
    if line.match(/^\[(\d+)\]/)
      # Save previous map if valid
      if current && 
         current[:flags].include?("ForWebPage") && 
         current[:x] && 
         current[:y]
        key = "#{current[:x]}-#{current[:y]}"
        maps[key] = current
      end
      
      current_id = $1
      current = {
        id: current_id,
        mapIngameID: current_id.to_i,
        mapName: "",
        x: nil,
        y: nil,
        mapWidth: 1,
        mapHeight: 1,
        color: "purple",
        outdoor: false,
        showArea: false,
        bicycle: false,
        # environment: nil,
        # battleBack: nil,
        # healingSpot: nil,
        # snapEdges: false,
        flags: [],
        # encounters: []
      }
    elsif current
      parts = line.split("=", 2)
      next unless parts.size == 2
      
      key = parts[0].strip
      value = parts[1].strip
      
      case key
      when "Name"
        current[:mapName] = value
        if value.include?("City")
          current[:color] = "blue"
        elsif value.include?("Route")
          current[:color] = "green"
        elsif value.include?("Cave")
          current[:color] = "gray"
        elsif value.include?("Forest")
          current[:color] = "emerald"
        elsif value.include?("Beach")
          current[:color] = "yellow"
        end
      when "MapPosition"
        pos_parts = value.split(",").map(&:to_i)
        if pos_parts.size >= 3
          current[:x] = pos_parts[1]
          current[:y] = pos_parts[2]-1
        end
      when "MapSize"
        size_parts = value.split(",")
        if size_parts.size == 2
          current[:mapWidth] = size_parts[0].to_i
          height_string = size_parts[1]
          current[:mapHeight] = height_string.length / current[:mapWidth]
        end
      when "Outdoor"
        current[:outdoor] = value.downcase == "true"
      when "ShowArea"
        current[:showArea] = value.downcase == "true"
      when "Bicycle"
        current[:bicycle] = value.downcase == "true"
      # when "Weather"
      #   current[:weather] = value
      # when "Environment"
      #   current[:environment] = value
      # when "BattleBack"
      #   current[:battleBack] = value
      # when "HealingSpot"
      #   current[:healingSpot] = value
      # when "SnapEdges"
      #   current[:snapEdges] = value.downcase == "true"
      when "Flags"
        current[:flags] = value.split(",").map(&:strip)
      end
    end
  end
  
  # Save last map
  # if current && 
  #    current[:flags].include?("ForWebPage") && 
  #    current[:x] && 
  #    current[:y]
  #   key = "#{current[:x]}_#{current[:y]}"
  #   maps[key] = current
  # end
  
  maps
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

# ==========================
# 🗑️ UTILIDADES
# ==========================
def delete_file(file_path)
  if File.exist?(file_path)
    File.delete(file_path)
    puts "🗑️  Archivo eliminado: #{file_path}"
    true
  else
    # puts "⚠️  Archivo no encontrado: #{file_path}"
    false
  end
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
      File.join(__dir__, "./items_absolutionRecipes.txt"),
      File.join(__dir__, "./items_dynamax.txt"),
      File.join(__dir__, "./items_stones.txt")
    ],
    suffix: "normal"
  },
  {
    output: File.join(__dir__, "../src/data/items_absolution.ts"),
    inputs: [File.join(__dir__, "./items_absolution.txt")],
    suffix: "absolution"
  }
]
items_configs.each do |config|
  items = parse_items(read_combined_lines(config[:inputs]), config[:suffix])
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
  abilities =
    parse_abilities(read_combined_lines(config[:inputs]), config[:suffix])
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
  trainer_types =
    parse_trainer_types(read_combined_lines(config[:inputs]), config[:suffix])
  write_ts(config[:output], "TrainerType", "trainerTypes", trainer_types)
  puts "✅ Trainer Types generados en #{config[:output]}"
end

# ========================================================== #
# Procesar Pokemon Forms
# ========================================================== #
# First, we need to load all base pokemons to merge with forms
all_base_pokemons = []
fakemon_configs.each do |config|
  all_base_pokemons +=
    parse_fakemons(read_combined_lines(config[:inputs]), config[:suffix])
end

forms_configs = [
  {
    output: File.join(__dir__, "../src/data/pokemon_forms.ts"),
    inputs: [
      File.join(__dir__, "./pokemon_forms.txt"),
      File.join(__dir__, "./pokemon_forms_stones.txt"),
      File.join(__dir__, "./pokemon_forms_gmax.txt")
    ],
    suffix: "normal"
  },
  {
    output: File.join(__dir__, "../src/data/pokemon_forms_absolution.ts"),
    inputs: [File.join(__dir__, "./pokemon_forms_absolution.txt")],
    suffix: "absolution"
  }
]

forms_configs.each do |config|
  forms =
    parse_forms(
      read_combined_lines(config[:inputs]),
      config[:suffix],
      all_base_pokemons
    )
  write_ts(config[:output], "PokemonForm", "pokemonForms", forms)
  puts "✅ Pokemon Forms generados en #{config[:output]}"
end

# ========================================================== #
# Procesar Map Metadata
# ========================================================== #
map_lines = read_combined_lines([File.join(__dir__, "./map_metadata.txt")])
maps_data = parse_map_metadata(map_lines)

# Write as Record<string, TileData>
output_path = File.join(__dir__, "../src/data/maps.ts")
File.write(output_path, "import type { TileData } from \"@/lib/map\";\n\n")
File.open(output_path, "a") do |file|
  file.puts "export const tilesData: Record<string, TileData> = "
  file.puts JSON.pretty_generate(maps_data).gsub(/"(\w+)":/, '\1:')
end
puts "✅ Map Metadata generado en #{output_path}"
# ========================================================== #
# Eliminar archivos no necesarios
# ========================================================== #
# Archivos que NO se usan en la generación de PBS/TypeScript
unused_files = %w[
  ./battle_facility_lists.txt
  ./battle_tower_pokemon.txt
  ./battle_tower_trainers.txt
  ./berry_plants.txt
  ./book_reading.txt
  ./cable_club_create.rb
  ./clotheSets.txt
  ./contacts.txt
  ./crafting.txt
  ./cup_fancy_pkmn_single.txt
  ./cup_fancy_pkmn.txt
  ./cup_fancy_trainers_single.txt
  ./cup_fancy_trainers.txt
  ./cup_little_pkmn.txt
  ./cup_little_trainers.txt
  ./cup_pika_pkmn.txt
  ./cup_pika_trainers.txt
  ./cup_poke_pkmn.txt
  ./cup_poke_trainers.txt
  ./dungeon_parameters.txt
  ./dungeon_tilesets.txt
  ./dungeonSet.txt
  ./encounters.txt
  ./items_tm.txt
  ./map_connections.txt
  ./metadata.txt
  ./misions_absolution.txt
  ./mounts.txt
  ./moves_dynamax.txt
  ./moves_monarch.txt
  ./phone.txt
  ./pokemon_metrics_female.txt
  ./pokemon_metrics_forms.txt
  ./pokemon_metrics_Gen_9_Pack.txt
  ./pokemon_metrics_gmax.txt
  ./pokemon_metrics.txt
  ./pokemon_monarch.txt
  ./pokePet.txt
  ./regional_dexes.txt
  ./ribbons.txt
  ./showHelp.txt
  ./town_map.txt
  ./trainers_1.txt
  ./trainers_2.txt
  ./trainers_3.txt
  ./trainers_dontTouch.txt
  ./trainers_drunk.txt
  ./trainers_extra.txt
  ./trainers_noForBattle.txt
  ./trainers_simulatedUniverse.txt
  ./trainers_twilightForest.txt
  ./types.txt
  package.json
  server.log
]

puts "\n🗑️  Eliminando archivos no utilizados..."
deleted_count = 0
not_found_count = 0

unused_files.each do |file_path|
  full_path = File.join(__dir__, file_path)
  if delete_file(full_path)
    deleted_count += 1
  else
    not_found_count += 1
  end
end

puts "\n📊 Resumen:"
puts "   ✅ Archivos eliminados: #{deleted_count}"
puts "   ⚠️  Archivos no encontrados: #{not_found_count}"
