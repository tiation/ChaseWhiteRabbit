&lt;template&gt;
  &lt;div class="min-h-screen bg-gray-50 dark:bg-gray-900"&gt;
    &lt;NGONavigation /&gt;
    
    &lt;main&gt;
      &lt;slot /&gt;
    &lt;/main&gt;
    
    &lt;NGOFooter /&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup lang="ts"&gt;
import NGONavigation from '../components/NGONavigation.vue'
import NGOFooter from '../components/NGOFooter.vue'
&lt;/script&gt;
