&lt;template&gt;
  &lt;nav class="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"&gt;
    &lt;div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"&gt;
      &lt;div class="flex justify-between items-center h-16"&gt;
        &lt;!-- Logo and Brand --&gt;
        &lt;div class="flex items-center"&gt;
          &lt;router-link to="/ngo" class="flex items-center space-x-3"&gt;
            &lt;div class="text-2xl"&gt;🐰&lt;/div&gt;
            &lt;div class="text-xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent"&gt;
              Chase White Rabbit NGO
            &lt;/div&gt;
          &lt;/router-link&gt;
        &lt;/div&gt;

        &lt;!-- Desktop Navigation --&gt;
        &lt;div class="hidden md:block"&gt;
          &lt;div class="flex items-center space-x-8"&gt;
            &lt;router-link 
              to="/ngo" 
              class="text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              :class="{ 'text-cyan-600 dark:text-cyan-400': $route.name === 'NGOHome' }"
            &gt;
              Home
            &lt;/router-link&gt;
            &lt;router-link 
              to="/ngo/programs" 
              class="text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              :class="{ 'text-cyan-600 dark:text-cyan-400': $route.name === 'NGOPrograms' }"
            &gt;
              Programs
            &lt;/router-link&gt;
            &lt;router-link 
              to="/ngo/volunteer" 
              class="text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              :class="{ 'text-cyan-600 dark:text-cyan-400': $route.name === 'NGOVolunteer' }"
            &gt;
              Volunteer
            &lt;/router-link&gt;
            &lt;a 
              href="#about" 
              class="text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            &gt;
              About
            &lt;/a&gt;
            &lt;a 
              href="#contact" 
              class="text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            &gt;
              Contact
            &lt;/a&gt;
          &lt;/div&gt;
        &lt;/div&gt;

        &lt;!-- CTA and Theme Toggle --&gt;
        &lt;div class="hidden md:flex items-center space-x-4"&gt;
          &lt;button 
            @click="toggleTheme"
            class="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500"
          &gt;
            &lt;svg v-if="isDark" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"&gt;
              &lt;path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /&gt;
            &lt;/svg&gt;
            &lt;svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"&gt;
              &lt;path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /&gt;
            &lt;/svg&gt;
          &lt;/button&gt;
          &lt;button class="px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg font-semibold hover:from-cyan-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"&gt;
            Donate Now
          &lt;/button&gt;
        &lt;/div&gt;

        &lt;!-- Mobile menu button --&gt;
        &lt;div class="md:hidden"&gt;
          &lt;button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500"
          &gt;
            &lt;svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24"&gt;
              &lt;path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /&gt;
              &lt;path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /&gt;
            &lt;/svg&gt;
          &lt;/button&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;!-- Mobile menu --&gt;
      &lt;div v-if="mobileMenuOpen" class="md:hidden"&gt;
        &lt;div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 dark:bg-gray-800 rounded-lg mt-2"&gt;
          &lt;router-link
            to="/ngo"
            @click="mobileMenuOpen = false"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            :class="{ 'text-cyan-600 dark:text-cyan-400 bg-gray-100 dark:bg-gray-700': $route.name === 'NGOHome' }"
          &gt;
            Home
          &lt;/router-link&gt;
          &lt;router-link
            to="/ngo/programs"
            @click="mobileMenuOpen = false"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            :class="{ 'text-cyan-600 dark:text-cyan-400 bg-gray-100 dark:bg-gray-700': $route.name === 'NGOPrograms' }"
          &gt;
            Programs
          &lt;/router-link&gt;
          &lt;router-link
            to="/ngo/volunteer"
            @click="mobileMenuOpen = false"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            :class="{ 'text-cyan-600 dark:text-cyan-400 bg-gray-100 dark:bg-gray-700': $route.name === 'NGOVolunteer' }"
          &gt;
            Volunteer
          &lt;/router-link&gt;
          &lt;a
            href="#about"
            @click="mobileMenuOpen = false"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          &gt;
            About
          &lt;/a&gt;
          &lt;a
            href="#contact"
            @click="mobileMenuOpen = false"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          &gt;
            Contact
          &lt;/a&gt;
          &lt;div class="flex items-center justify-between px-3 py-2"&gt;
            &lt;button 
              @click="toggleTheme"
              class="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500"
            &gt;
              &lt;svg v-if="isDark" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"&gt;
                &lt;path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /&gt;
              &lt;/svg&gt;
              &lt;svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"&gt;
                &lt;path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /&gt;
              &lt;/svg&gt;
            &lt;/button&gt;
            &lt;button 
              @click="mobileMenuOpen = false"
              class="px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg font-semibold hover:from-cyan-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
            &gt;
              Donate Now
            &lt;/button&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/nav&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const mobileMenuOpen = ref(false)

// Mock theme store - replace with actual theme store
const isDark = ref(false)

const toggleTheme = () =&gt; {
  isDark.value = !isDark.value
  // Add actual theme toggle logic here
  document.documentElement.classList.toggle('dark')
}

// Close mobile menu when route changes
watch(() =&gt; route.path, () =&gt; {
  mobileMenuOpen.value = false
})
&lt;/script&gt;

&lt;style scoped&gt;
/* Additional styles if needed */
&lt;/style&gt;
