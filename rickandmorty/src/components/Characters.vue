<template>
    <div class="filter-container">
        <input type="text" v-model="filterName" placeholder="Имя персонажа">
        <input type="text" v-model="filterStatus" placeholder="Статус персонажа">
        <button @click="applyFilter">Применить</button>
    </div>
    <div class="characters-container">
        <div class="character-card" v-for="character in characters" :key="character.id">
            <img :src="character.image" :alt="character.name" class="character-image"/>
            <div class="character-info">
                <h2>{{ character.name }}</h2>
                <p><strong>Status:</strong> {{ character.status }}</p>
                <p><strong>Species:</strong> {{ character.species }}</p>
                <p><strong>Gender:</strong> {{ character.gender }}</p>
                <p class="character-location"><strong>Location:</strong> {{ character.location.name }}</p>
            </div>
        </div>
    </div>
    <div class="pagination">
        <button @click="loadCharacters(prevPageUrl)" :disabled="!prevPageUrl">Предыдущая страница</button>
        <button @click="loadCharacters(nextPageUrl)" :disabled="!nextPageUrl">Следующая страница</button>
    </div>
</template>
  
<script lang="ts">
    import { defineComponent, onMounted, ref } from 'vue';
    
    interface Location {
        name: string;
    }
    
    interface Character {
        id: number;
        name: string;
        status: string;
        species: string;
        gender: string;
        image: string;
        location: Location;
    }
    
    export default defineComponent({
        name: 'RickAndMortyCharacters',
        setup() {
            const characters = ref<Character[]>([]);
            const nextPageUrl = ref<string | null>(null);
            const prevPageUrl = ref<string | null>(null);
            const filterName = ref<string>('');
            const filterStatus = ref<string>('');

            const loadCharacters = async (url: string | null) => {
            if (!url) return;

                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    characters.value = data.results;
                    nextPageUrl.value = data.info?.next || null;
                    prevPageUrl.value = data.info?.prev || null;

                } catch (error) {
                    console.error("There was an error fetching the characters:", error);
                }
            };

            const applyFilter = () => {
                const queryParams = new URLSearchParams();
                if (filterName.value) {
                    queryParams.append('name', filterName.value);
                }
                if (filterStatus.value) {
                    queryParams.append('status', filterStatus.value);
                }
                loadCharacters(`https://rickandmortyapi.com/api/character/?${queryParams.toString()}`);
                };

            
        
            onMounted(() => {
            loadCharacters('https://rickandmortyapi.com/api/character');
            });

            return {
            characters,
            loadCharacters,
            nextPageUrl,
            prevPageUrl,
            filterName,
            filterStatus,
            applyFilter
            };
        }
    });
</script>
  
<style>
    .filter-container {
    margin-bottom: 20px;
    text-align: center;
    }

    .filter-container input {
    margin: 0 10px;
    padding: 8px;
    }

    .filter-container button {
    padding: 8px 16px;
    }

    .characters-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
    }

    .character-card {
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    max-width: 500px;
    }

    .character-image {
    width: 50%;
    object-fit: cover;
    }

    .character-info {
    padding: 15px;
    width: 50%;
    }

    .character-info h2 {
    margin-top: 0;
    }

    .character-location {
    font-style: italic;
    }
</style>