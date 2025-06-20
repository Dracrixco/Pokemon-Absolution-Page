require 'json'

INPUT_FILE = File.join(__dir__, './pokemon_absolution.txt')
OUTPUT_FILE = File.join(__dir__, '../src/data/pokemon.ts')

fakemons = []
current = nil

File.readlines(INPUT_FILE).each do |line|
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
        hp: 0,
        attack: 0,
        defense: 0,
        spAttack: 0,
        spDefense: 0,
        speed: 0
      },
      height: '',
      weight: '',
      abilities: [],
      hiddenAbilities: [],
      category: ''
    }
  elsif current
    key, value = line.split('=', 2).map(&:strip)

    case key
    when 'Name'
      current[:name] = value
    when 'Types'
      current[:types] = value.split(',')
    when 'BaseStats'
      stats = value.split(',').map(&:to_i)
      current[:stats] = {
        hp: stats[0],
        attack: stats[1],
        defense: stats[2],
        spAttack: stats[3],
        spDefense: stats[4],
        speed: stats[5]
      }
    when 'Height'
      current[:height] = value
    when 'Weight'
      current[:weight] = value
    when 'Abilities'
      current[:abilities] = value.split(',')
    when 'HiddenAbilities'
      current[:hiddenAbilities] = value.split(',')
    when 'Category'
      current[:category] = value
    when 'Pokedex'
      current[:description] = value
    end
  end
end

fakemons << current if current

# Escribir archivo TS
File.write(OUTPUT_FILE, "import type { Fakemon } from \"@/types/fakemon\"; \n\rexport const fakemons: Fakemon[] = ")
File.open(OUTPUT_FILE, 'a') do |file|
  file.puts JSON.pretty_generate(fakemons).gsub(/"(\w+)":/, '\1:') # quitar comillas de claves
end

puts "✅ Archivo generado en #{OUTPUT_FILE}"
